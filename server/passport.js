import { Strategy as LocalStrategy } from "passport-local";
import User from "./model/User.js";
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
dotenv.config();
// import passport from 'passport'

export const configureLocalPassport = (passport) => {
    passport.use(new LocalStrategy(
        {
            usernameField: 'username',
            passwordField: 'password',
        },
        async (username, password, done) => {
            try {
                const user = await User.findOne({ username });
                if (!user) {
                    return done(null, false, { message: 'No subscriber found' });
                }

                const isValid = await user.comparePassword(password);
                if (!isValid) {
                    return done(null, false, { message: 'Incorrect password' });
                }

                return done(null, user);
            } catch (err) {
                return done(err);
            }
        },
    
    ));

    passport.use(passport.serializeUser((user, done) => {
        done(null, user.id); // or user._id depending on your DB
        console.log(user.id)
        }),
    
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id); // or your user model
            done(null, user);
            console.log("serialized", user)
        } catch (err) {
            done(err);
        }
    }))

}

export const configureGooglePassport = (passport) => {
    passport.use(new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL:'http://localhost:7334/oauth2/redirect/google',
            scope: ['profile', 'email']
        },
        async (accessToken, refreshToken, profile, done) => {
            const newUser = {
                "google.name": profile.displayName, // Use displayName for the name
                "google.email": profile.emails[0].value, // Use emails[0].value for email
                "google.accessToken": accessToken,  // ✅ save token   
                active: true,
            };
            const googleUser = await User.findOne({ 'google.email': profile.emails[0].value })
            const localUser = await User.findOne({ email: profile.emails[0].value })
    
            try {
                if (googleUser && localUser) {
                    return done(null, googleUser)
                } else if (googleUser) {
                    return done(null, googleUser)
                } else if (localUser) {
                    localUser.google = {
                        email: profile.emails[0].value,
                        displayName: profile.displayName,
                        accessToken
                    }
                    await localUser.save();
                    console.log('Local user updated with Google info');
                    done(null, localUser)
                }
                else { //User is new
                    const user = User.create(newUser)
                    done(null, user)
                }
            }
            catch (err) {
                console.error("Google authentication error:", err.message)
                done(err, null)
            }
        })
    )

     passport.use(passport.serializeUser((user, done) => {
        done(null, user.id); // or user._id depending on your DB
        console.log(user.id)
        }),
    
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id); // or your user model
            done(null, user);
            console.log("serialized", user)
        } catch (err) {
            done(err);
        }
    }))
}