import express from 'express';
import { signupController, loginController } from './controllers.js';
import passport from 'passport';
import User from './model/User.js';
import { configureGooglePassport, configureLocalPassport } from './passport.js';
import { loginSession } from './middleware.js';
import { isAuthenticatedUser } from './controllers.js';
import Chat from './model/Chat.js';

const authRouter = express.Router();

configureLocalPassport(passport);

configureGooglePassport(passport)

authRouter.get('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('http://localhost:3000/login');
  });
});

authRouter.post('/signup', signupController)

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
        const currentUserId = req.session.user?._id;
        console.log(currentUserId)
      if (!currentUserId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
  
      const { userId } = req.query;
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
            path: 'sender',
            model: 'User',
            select: 'username _id',
          },
        });
  
      if (!chat) {
        return res.json({ messages: [] });
      }
  
      res.json({ messages: chat.messages });
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
    console.log("USER AUTHENTICATED", req.session?.user)
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