import express from 'express';
import { signupController, loginController } from './controllers.js';
import passport from 'passport';
import User from './model/User.js';
import { configureGooglePassport, configureLocalPassport } from './passport.js';
import { loginSession } from './middleware.js';
import { isAuthenticatedUser } from './controllers.js';
import Chat from './model/Chat.js';
import UnreadMsg from './model/UnreadMsg.js';

const authRouter = express.Router();

configureLocalPassport(passport);

configureGooglePassport(passport)

authRouter.get('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/login');
  });
});

authRouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
authRouter.get('/oauth2/redirect/google', passport.authenticate('google'), (req, res, next) => {
  try {
        req.session.user = req.user
    req.session.authenticated = req.isAuthenticated()
    // res.json({ message: 'Login successful', user: req.user, isValid: req.isAuthenticated() });
        res.redirect('/');
    } catch (err) {
        res.redirect('/login')
    }
})

authRouter.post('/signup', signupController);
// authRouter.post('/signin',  passport.authenticate('local'), (req, res, next) => {
//     // next();
//     // res.redirect('/')
//     try {
//       req.session.user = req.user
//       req.session.authenticated = req.isAuthenticated()
//       res.json({ message: 'Login successful', user: req.user, isValid: req.isAuthenticated() });
//     //   res.redirect('/');
//   } catch (err) {
//       res.redirect('/login')
//   }
//     next()

// });

authRouter.post('/signin', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err || !user) {
        return res.status(401).json({ error: info?.message || 'Unauthorized' });
      }
  
      req.logIn(user, (err) => {
        if (err) return res.status(500).json({ error: 'Login error' });
  
        req.session.user = user;
        req.session.authenticated = true;
        return res.json({ message: 'Login successful', user });
      });
    })(req, res, next);
  });
  
  authRouter.get('/api/getChatHistory', async (req, res) => {
      try {
        const { userId, currentUserId } = req.query;
        // const currentUserId = req.session.user?._id;
      if (!currentUserId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      
      if (!userId) {
        return res.status(400).json({ error: 'Missing userId in query' });
      }
  
      const chat = await Chat.findOne({
        members: { $all: [currentUserId, userId], $size: 2 },
        isGroup: false,
      })
        .populate({
          path: 'messages',
          model: 'ChatMessage',
          options: { sort: { createdAt: 1 } }, // Sort messages chronologically
          populate: {
            path: 'sender receiver',
            model: 'User',
            select: 'username _id picture isOnline lastMessage lastMessageCount unread',
          },
        });
  
      if (!chat) {
        return res.json({ messages: [] });
      }
          const selectedUser = await User.findById(userId);
          const currentUser = await User.findById(currentUserId);
        if (selectedUser) {
            selectedUser.lasMessageCount = 0
            await selectedUser.save();
        }
         
   const unreadEntry = await UnreadMsg.findOne({
                   recipient: selectedUser._id,
                   sender: currentUser._id,
                   unreadMsgs: { $exists: true, $not: { $size: 0 } }
               });
       
          if (unreadEntry) {
              // Delete the specific unread entry
              const result = await UnreadMsg.deleteOne({
                  _id: unreadEntry._id
              });
       
              console.log(`🗑️ Deleted ${result.deletedCount} unread message(s) from ${currentUser.username} to ${selectedUser.username}`);
          }
        //   await UnreadMsg.deleteMany({ recipient: selectedUser, sender: currentUser });
  
      res.json({ messages: chat.messages, notifiedUser: currentUser});
    } catch (err) {
      console.error('❌ Error getting chat history:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
authRouter.post("/paystack/webhook", express.json(), (req, res) => {
  const { event, data } = req.body;

  if (event === "charge.success") {
    const reference = data.reference;
    const email = data.customer.email;
    console.log(`Payment successful for ${email}, ref: ${reference}`);
    // You can update DB status here
  }

  res.sendStatus(200);
});


authRouter.get('/isAuthenticated', loginSession, (req, res) => {
    // console.log("USER AUTHENTICATED", req.session?.user)
    res.json({ user: req.user });
  });
  

export var authenticatedUser = {}

// authRouter.post('/login', loginController);
authRouter.use((req, res, next) => {
//   console.log("USER AUTHENTICATED", req.session?.user)
//   console.log("USER ISAUTHENTICATED", req.authenticated())
  authenticatedUser.user = req.session.user
  authenticatedUser.isActive = req.session.authenticated
  next()
})


export default authRouter