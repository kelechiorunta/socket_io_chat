import User from './model/User.js';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { createTransport } from 'nodemailer';

export const emailValidationSchema = [body('email').isEmail().withMessage('Invalid email format')];

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const isAuthenticatedUser = (req, res) => {
  if (req.user || req.isAuthenticated()) {
    return res
      .status(200)
      .json({ isValid: true, user: req.user, message: 'User still authenticated!' });
  } else {
    return res.status(400).json({
      isValid: false,
      user: null,
      message: 'User not authenticated. Please login or signup!'
    });
  }
};

export const signupController = async (req, res) => {
  const { username, password, email } = req.body;

  try {
    if (!username || !password || !email) {
      return res.status(400).json({ error: 'All fields are required!' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists!' });
    }

    const newUser = new User({ username: username, password: password, email: email });
    await newUser.save();

    // Optionally log them in immediately:
    req.login(newUser, (err) => {
      if (err) return res.status(500).json({ error: 'Auto-login failed after signup' });
      return res.status(201).json({ message: 'Signup successful', user: newUser });
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error during signup' });
  }
};

// This needs JWT deserialization. No need for this since Passport.js has its serialization strategy after signup or login
// export const signupController = async (req, res, next) => {
//     const { username, email, password } = req.body
//     try {
//         if (!email || !password || !username) {
//             return res.status(401).json({ error: "Invalid or Incomplete entries" })
//         }

//         const user = await User.findOne({ email });

//         if (user) {
//             return res.status(401).json({ error: "User already exists"})
//         }

//         const newUser = new User({ username, email, password })
//         // newUser.token = token;
//         await newUser.save()
//         const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET, { expiresIn: '1d' })

//         if (req.session) {
//          req.session.token = token
//         }
//         next()
//         // res.status(200).json({message: "User signed up successfully", user: req.session.token})
//     }
//     catch (err) {
//         res.status(500).json({error: err})
//     }
// }

export const loginController = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(401).json({ error: 'Invalid or Incomplete entries' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'User does not exist' });
    }

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Wrong Password' });
    }

    const token = await jwt.verify(user.token, process.env.JWT_SECRET);

    if (req.session) {
      if (token) {
        req.session.token = token;
      }
    }

    res.status(200).json({ message: 'User signed up successfully', user: token });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const forgotPasswordController = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) {
      return res.status(401).json({ error: 'Please enter in a valid email address' });
    }

    const user = await User.findOne({ email });

    if (!user) return res.status(401).json({ error: 'User not found' });

    if (user) {
      const resetTokenExpiry = Date.now() + 10 * 60 * 1000; // Token valid for 10 minutes
      const token = jwt.sign({ id: user?._id }, process.env.JWT_SECRET, { expiresIn: '10m' });
      user.resetPasswordToken = token;
      user.resetPasswordExpires = resetTokenExpiry;
      await user.save();
    }
    // Use nodemailer to send an approval link to reset the password.

    const resetLink = `https://socketiochat-production.up.railway.app/reset-password/${user?.username}`;
    // Send reset email with token
    const transporter = createTransport({
      service: 'gmail', // Use Gmail or any other email service
      auth: {
        user: process.env.EMAIL_USER, // Your email address or app-specific email
        pass: process.env.EMAIL_PASS // Your email password or app-specific password
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset',
      html: `<p>You requested a password reset. Click the link below to reset your password:</p>
             <p>Your token expires in ten minutes:</p>
             <a href="${resetLink}">Reset Password</a>
             <p>If you did not request this, please ignore this email.</p>`
    };

    const response = await transporter.sendMail(mailOptions);

    if (response.rejected && response.rejected.length > 0) {
      return res.status(552).json({
        error: `Email could not be delivered to: ${response.rejected.join(', ')}. It is not a registered cloud email.`
      });
    }

    return res.status(200).json({ message: 'Password reset email sent' });

    // next();
    // res.status(200).json({message: "User signed up successfully", user: req.session.token})
  } catch (err) {
    if (err?.response?.status === 429) return res.status(429).json({ error: 'Too many requests.' });
    res.status(500).json({ error: err });
  }
};

// export const profileController = (req, res) => {
//   if (!req.session.token) {
//     return res.status(401).json({ error: 'Unauthorized' });
//   }

//   // Decode if needed
//   const decoded = jwt.verify(req.session.token, process.env.JWT_SECRET);

//   res.status(200).json({ message: 'Profile accessed', user: decoded });
// };

// import User from "./models/User.js";
// import jwt from 'jsonwebtoken';

// export const signupController = async (req, res) => {
//   const { username, email, password } = req.body;
//   if (!email || !password || !username) {
//     return res.status(400).json({ error: "Missing fields" });
//   }

//   const existing = await User.findOne({ email });
//   if (existing) return res.status(409).json({ error: "User exists" });

//   const newUser = new User({ username, email, password });
//   await newUser.save();

//   const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
//     expiresIn: '1d'
//   });

//   res.cookie('token', token, {
//     httpOnly: true,
//     maxAge: 86400000 // 1 day
//   });

//   res.status(201).json({ message: "Signup successful" });
// };

// export const loginController = async (req, res) => {
//   const { email, password } = req.body;
//   if (!email || !password) {
//     return res.status(400).json({ error: "Missing credentials" });
//   }

//   const user = await User.findOne({ email });
//   if (!user || !(await user.comparePassword(password))) {
//     return res.status(401).json({ error: "Invalid email or password" });
//   }

//   const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//     expiresIn: '1d'
//   });

//   res.cookie('token', token, {
//     httpOnly: true,
//     maxAge: 86400000
//   });

//   res.status(200).json({ message: "Login successful" });
// };

export const profileController = (req, res, next) => {
  if (req.session) {
    const token = req.session.user;
    if (!token) return res.status(401).json({ error: 'Not authenticated' });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
      // res.status(200).json({ message: "Profile data", user: decoded });
    } catch (err) {
      res.status(403).json({ error: 'Invalid token' });
    }
  }
};
