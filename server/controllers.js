import User from "./model/User.js";
import jwt from 'jsonwebtoken'

export const isAuthenticatedUser = (req, res) => {
    if (req.user || (req.isAuthenticated())) {
        return res.status(200).json({ isValid:true, user: req.user, message: "User still authenticated!" })
    } else {
        return res.status(400).json({ isValid:false, user: null, message: "User not authenticated. Please login or signup!" })
    }
}


export const signupController = async (req, res) => {
    const { username, password, email } = req.body;
  
    try {
      if (!username || !password ||!email) {
        return res.status(400).json({ error: 'All fields are required!' });
      }
  
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists!' });
      }
  
      const newUser = new User({ username, password, email });
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
    const { email, password } = req.body
    try {
        if (!email || !password) {
            return res.status(401).json({ error: "Invalid or Incomplete entries" })
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ error: "User does not exist"})
        }

        const isValidPassword = await user.comparePassword(password);
        if (!isValidPassword) {
            return res.status(400).json({error: "Wrong Password"})
        }

        const token = await jwt.verify(user.token, process.env.JWT_SECRET);
        
        if (req.session) {
            if (token) {
                req.session.token = token
            }
        }

        res.status(200).json({message: "User signed up successfully", user: token})
    }
    catch (err) {
        res.status(500).json({error: err})
    }
}

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
    res.status(403).json({ error: "Invalid token" });
  }
  }
  
};