import http from 'http';
import path from 'path'
import { WebSocketServer } from 'ws';
import express from 'express';
import { Server } from 'socket.io';
import cors from 'cors';
import { createHandler } from 'graphql-http/lib/use/express';
import { loadFilesSync } from '@graphql-tools/load-files'
import { makeExecutableSchema } from '@graphql-tools/schema';
import resolvers from './resolvers.js';
import { fileURLToPath } from 'url';
import { connectDB } from './db.js';
import { graphqlHTTP } from 'express-graphql';
import passport from 'passport';
import Message from './model/Message.js';
import ConnectMongoDBSession from 'connect-mongodb-session'
import session from 'express-session'
import authRouter from './router.js';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

connectDB(process.env.MONGO_URI);
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const typeDefs = loadFilesSync(path.join(__dirname, './schema.graphql'))
const schema = makeExecutableSchema({
    typeDefs, resolvers
})

const app = express();
const PORT = 7334;
const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');
const corsOption = {
    origin: function (origin, callback) {
        if (allowedOrigins.includes(origin)) {
            return callback(null, true)
        } else {
            return callback(false, new Error("Domain not supported"))
        }
    },
    allowedHeaders: ['Content-Type', 'Authorization'],
    method: ['GET', 'POST'],
    credentials: true
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
      secure: false,           // don’t use true unless HTTPS
      sameSite: 'lax',
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
    store: store
  }

app.use(cors(corsOption))
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

app.use('/', authRouter);

  // Middleware to enable GraphQL Introspection and Client Queries
app.use(
    '/graphql',
    graphqlHTTP((req) => {
      const isDev = process.env.NODE_ENV === 'development';
      const protocol = isDev ? 'ws' : 'wss';
      const host = isDev ? 'localhost:7334' : req.headers.host;
  
      return {
        schema,
          context: {
              
                isAuthenticated: req.isAuthenticated?.(),
                user: req.user ?? req.session?.user,
          },
        graphiql: true
        // graphiql: {
        //   subscriptionEndpoint: `${protocol}://${host}/graphql`,
        // },
      };
    })
  );
  
const server = http.createServer(app);
const io = new Server(server, { cors: corsOption})
// const ws = new WebSocketServer({ server });

io.engine.on('connection', (socket) => {
    console.log(socket?.request?.url)
})

io.engine.on('connection_error', (err) => {
    console.error(err.message)
})

io.on('connection', (socket) => {
    console.log('✅ Client connected:', socket.id);

    // When the client sends a message
    socket.on('message', (data, callback) => {
        console.log('Received:', data);
        // callback('Message received successfully');
        
        // Send confirmation back to the same client
        // socket.emit('message', 'Got your message');

        // Broadcast the message to all other clients
        socket.broadcast.emit('message', data);
    });

    socket.on('joinChat', ({ userId }) => {
        console.log(`${userId} logged in`);
        socket.data.userId = userId;
        socket.join(userId); // personal room
      });
    
    socket.on('sendMessage', async ({ content, receiverId, groupId }) => {
        const senderId = socket.data.userId;
    
        // Save message to DB
        const msg = new Message({ content, sender: senderId, receiver: receiverId, groupId });
        await msg.save();
    
        // Determine which room to emit to
        const room = groupId || receiverId;
        io.to(room).emit('newMessage', msg);
     });
    
    socket.on('createGroup', ({ groupId, memberIds }) => {
        memberIds.forEach(id => socket.join(id)); // ensures they join their personal rooms
        io.emit('groupCreated', { groupId, members: memberIds }); 
    });

    socket.on('disconnect', () => {
        console.log('🔴 Client disconnected:', socket.id);
    });
});

server.listen(PORT, () => {
  console.log(`WebSocket server listening on ws://localhost:${PORT}`);
});
