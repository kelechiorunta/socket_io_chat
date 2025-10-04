import rateLimit from './config/ratelimit.js';

export const loginSession = (req, res, next) => {
  console.log('Authenticated?', req.isAuthenticated());
  console.log('Session:', req.session);
  console.log('User:', req.user);

  // Check if user is authenticated with Passport
  if (!req.isAuthenticated() || !req.user) {
    return res.redirect('/login');
  }
  req.session.user = req.user;
  req.session.save((err) => {
    if (err) {
      console.error('Error saving sessions', err);
    }
    console.log('Session saved successfully');
  });
  // if (!req.isAuthenticated() || !req.user) {
  //     return res.status(401).json({ error: 'Unauthorized' }); // ⬅️ return JSON instead of redirect
  //   }
  next();
};

export const rateLimitMiddleware = async (req, res, next) => {
  try {
    const { success } = await rateLimit.limit(req.user?._id);

    if (!success) {
      return res.status(429).json({
        error: `Too many requests. ${req.user?.username}, you have exceeded your rate limit! Please wait after a minute.`
      });
    }
    next();
  } catch (error) {
    console.error(error);
    next(error);
  }
};
