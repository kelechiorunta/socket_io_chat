import http from 'http';
import path from 'path'
// import { WebSocketServer } from 'ws';
import express from 'express';
import { Server } from 'socket.io';
import cors from 'cors';
// import { createHandler } from 'graphql-http/lib/use/express';
import { loadFilesSync } from '@graphql-tools/load-files'
import { makeExecutableSchema } from '@graphql-tools/schema';
import resolvers from './resolvers.js';
import { fileURLToPath } from 'url';
import { connectDB } from './db.js';
import { graphqlHTTP } from 'express-graphql';
import passport from 'passport';
import dotenv from 'dotenv'
// import Message from './model/Message.js';
import ConnectMongoDBSession from 'connect-mongodb-session'
import session from 'express-session'
import authRouter from './router.js';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import ChatMessage from './model/ChatMessage.js';
import Chat from './model/Chat.js';
import User from './model/User.js';
import UnreadMsg from './model/UnreadMsg.js';
dotenv.config();

connectDB(process.env.MONGO_URI);

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const typeDefs = loadFilesSync(path.join(__dirname, './schema.graphql'))
const schema = makeExecutableSchema({
    typeDefs, resolvers
})

const app = express();
const PORT = process.env.PORT || 7334;

// const ALLOWED_ORIGINS = 'http://localhost:7334,http://localhost:3000,http://localhost:3001,https://chatvercelsocketio.vercel.app,https://socketiochat-production.up.railway.app'
// const allowedOrigins = ALLOWED_ORIGINS.split(',');

const ALLOWED_ORIGINS = ['http://localhost:7334', 'http://localhost:3000', 'http://localhost:3001', 'https://chatvercelsocketio.vercel.app', 'https://socketiochat-production.up.railway.app']

const corsOption = {
    origin: function (origin, callback) {
        if (ALLOWED_ORIGINS.includes(origin) || !origin) {
            return callback(null, true)
        } else {
            return callback(false, new Error("Domain not supported"))
        }
    },
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  optionsSuccessStatus: 200,
}

const MongoDBStore = ConnectMongoDBSession(session)
const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: 'sessions',
  expires: 1000 * 60 * 60 * 24 * 7
} // Sessions expire after 1 week}
);

if (store) {
  // console.log(store)
  store.on('error', (err) => { console.error(err) })
}
const sessionOptions = {
    name: "auth_session",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
    store: store
  }

app.use(cors(corsOption))
// app.use(
//   cors({
//     origin: ['http://localhost:7334', 'https://socketiochat-production.up.railway.app', 'http://localhost:3000', 'https://chatvercelsocketio.vercel.app'],
//     credentials: true,
//     allowedHeaders: ['Content-Type', 'Authorization'],
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     optionsSuccessStatus: 200,
//   })
// );
// app.use('/graphql', createHandler({
//     schema,
//     context: async (req) => ({ user: req.user }), // optional
// }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))
app.use(session(sessionOptions))
// Initialize passport
app.use(passport.initialize())
app.use(passport.session())

app.use('/*', authRouter);



  // Middleware to enable GraphQL Introspection and Client Queries
  app.use(
    '/graphql',
    graphqlHTTP((req) => {
      const isDev = process.env.NODE_ENV === 'development';
  
      return {
        schema,
        context: {
          isAuthenticated: req.isAuthenticated?.(),
          user: req.user ?? req.session?.user,
        },
        graphiql: isDev, // Only enable GraphiQL in development
      };
    })
  );
  

// app.set('trust proxy', true); // Trust Railway's proxy
  
const server = http.createServer(app);
const io = new Server(server, { cors: corsOption})
// const ws = new WebSocketServer({ server });
const onlineUsers = new Map();

io.engine.on('connection', (socket) => {
    console.log(socket?.request?.url)
})

io.engine.on('connection_error', (err) => {
    console.error(err.message)
})

io.on('connection', (socket) => {
    console.log('✅ Client connected:', socket.id);

    socket.on('isLoggedIn', async ({ userId }) => {
        socket.data.userId = userId;
        onlineUsers.set(userId, socket.id);
        const signedInUser = await User.findById(userId);
        if (signedInUser) {
            signedInUser.isOnline = true
            await signedInUser.save();
            socket.broadcast.emit('userOnline', { userId, online: signedInUser.isOnline });
        }
        console.log(onlineUsers);
    
        // Notify others this user came online
       
    
        // ✅ Send current online users to the newly logged-in user
        const otherOnlineUsers = [...onlineUsers.keys()].filter((id) => id !== userId);
        // Set isOnline = true in DB for others (optional if you want to persist status)
        for (const id of otherOnlineUsers) {
            const userDoc = await User.findById(id);
            if (userDoc) {
            userDoc.isOnline = true;
            await userDoc.save();
            }
        }
       
        socket.emit('currentlyOnline', { userIds: otherOnlineUsers, online: true });
    });
    
    socket.on('isOnline', ({ receiverId }) => {
        const senderId = socket.data.userId;
        if (!receiverId || !senderId) return;
    
        const receiverSocketId = onlineUsers.get(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('isConnected', { currentUser: senderId });
        }
    })
  
    socket.on('joinChat', ({ userId }) => {
      if (!userId) return;
      console.log(`${userId} joined chat`);
      socket.data.userId = userId;
      socket.join(userId); // Join personal room
    });
  
    socket.on('markAsRead', async ({ senderId, receiverId }) => {
        if (!senderId || !receiverId) {
            console.warn('❗ senderId or receiverId not provided');
            return;
        }
    
        try {
            const sender = await User.findById(senderId);
            const recipient = await User.findById(receiverId);
    
            if (!sender || !recipient) {
                console.warn('❗ Sender or recipient not found in DB');
                return;
            }
    
            // Check if there are unread messages from sender to this recipient
            const unreadEntry = await UnreadMsg.findOne({
                recipient: recipient._id,
                sender: sender._id,
                unreadMsgs: { $exists: true, $not: { $size: 0 } }
            });
    
            if (unreadEntry) {
                // Delete the specific unread entry
                const result = await UnreadMsg.deleteOne({
                    _id: unreadEntry._id
                });
    
                console.log(`🗑️ Deleted ${result.deletedCount} unread message(s) from ${sender.username} to ${recipient.username}`);
    
                // Emit confirmation only if deletion was successful
                socket.emit('messagesMarkedAsRead', { senderId });
            } else {
                console.log(`✅ No unread messages found from ${sender.username} to ${recipient.username}`);
            }
    
        } catch (error) {
            console.error('❌ Error in markAsRead socket handler:', error);
        }
    });
    
    
    socket.on('sendMessage', async ({ content, receiverId }) => {
        const senderId = socket.data.userId;
        if (!senderId || !receiverId || !content) return;
      
        try {
          // ✅ Find or create the 1-to-1 chat
          let chat = await Chat.findOne({
            members: { $all: [senderId, receiverId], $size: 2 },
            isGroup: false,
          });
      
          if (!chat) {
            chat = new Chat({ members: [senderId, receiverId], isGroup: false });
            await chat.save();
          }
      
          // ✅ Create and save new message
          let message = new ChatMessage({
            chat: chat._id,
            sender: senderId,
            receiver: receiverId,
            content,
          });
      
          await message.save();
      
          // ✅ Update sender/receiver user data
          const recipientUser = await User.findById(receiverId);
          const senderUser = await User.findById(senderId);
      
          // ✅ Track unread only if recipient is offline
        //   const isRecipientOnline = onlineUsers && onlineUsers.has(receiverId);
            // if (!isRecipientOnline) {
                // Update sender metadata
                senderUser.lastMessage = content;
                senderUser.lastMessageCount = (senderUser.lastMessageCount || 0) + 1;
      
                // ✅ Add to or update UnreadMsg collection
                let unreadEntry = await UnreadMsg.findOne({
                    recipient: receiverId,
                    sender: senderId,
                });
              
                if (!unreadEntry) {
                    unreadEntry = new UnreadMsg({
                        recipient: recipientUser,
                        sender: senderUser,
                        count: 1,
                        lastMessage: content,
                    });
                } else {
                    unreadEntry.count += 1;
                    unreadEntry.lastMessage = content;
                }
              
                await unreadEntry.save();
                console.log("Saved successfully to unread")
              
                // Attach to user if not already present
                if (!recipientUser.unread.includes(unreadEntry._id)) {
                    recipientUser.unread.push(unreadEntry._id);
                    await recipientUser.save();
                }
            // } 
      
          // ✅ Add message to chat
          chat.messages.push(message._id);
          await chat.save();
      
          // ✅ Populate sender/receiver for frontend
          message = await message.populate([
            { path: 'sender', select: 'username picture isOnline lastMessage lastMessageCount' },
            { path: 'receiver', select: 'username picture isOnline' },
          ]);
      
          // ✅ Emit updated message to both users
          [senderId, receiverId].forEach((id) => {
            io.to(id).emit('newMessage', {
              _id: message._id,
              chatId: chat._id,
              sender: message.sender,
              receiver: message.receiver,
              content: message.content,
              createdAt: message.createdAt,
              lastMessage: content,
              unreadCounts: recipientUser.unreadCounts,
              unreadMsgs: recipientUser.unread,
            });
          });
        } catch (error) {
          console.error('❌ sendMessage error:', error);
        }
      });
      
      
    // socket.on('typing', ({ receiverId }) => {
    //     const senderId = socket.data.userId;
    //     if (!receiverId || !senderId) return;
      
    //     // Emit 'typing' to the receiver's room
    //     io.to(receiverId).emit('typing', { from: senderId });
    // });

    socket.on('typing', ({ receiverId }) => {
        const senderId = socket.data.userId;
        const receiverSocketId = onlineUsers.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('typing', { from: senderId });
        }
    });
      
  
    socket.on('disconnect', async() => {
        console.log('🔴 Client disconnected:', socket.id);
        const userId = socket.data.userId;
        if (userId) {
            const signedOutUser = await User.findById(userId)
            if (signedOutUser) {
                signedOutUser.isOnline = false
                await signedOutUser.save();
            }
        onlineUsers.delete(userId);
        socket.broadcast.emit('userOffline', { userId });
    }
    });
});

app.use(express.static(path.resolve('build')));

// app.get('/', (req, res) => {
//   res.sendFile(path.resolve('build', 'index.html'))
// })
  
server.listen(PORT, () => {
  console.log(`WebSocket server listening on ws://localhost:${PORT}`);
});

