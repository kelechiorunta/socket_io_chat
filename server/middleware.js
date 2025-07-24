export const loginSession = (req, res, next) => {
  console.log('Authenticated?', req.isAuthenticated());
  console.log('Session:', req.session);
  console.log('User:', req.user);

  // Check if user is authenticated with Passport
  if (!req.isAuthenticated() || !req.user) {
    return res.redirect('/login');
  }
  // if (!req.isAuthenticated() || !req.user) {
  //     return res.status(401).json({ error: 'Unauthorized' }); // ⬅️ return JSON instead of redirect
  //   }
  next();
};
