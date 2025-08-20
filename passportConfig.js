import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "./src/models/user.model.js";

export default () => {
  passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.SERVER_URL}/auth/google/callback`
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const existingUser = await User.findOne({ email  });

        if (existingUser){
           if (!existingUser.googleId) {
              existingUser.googleId = profile.id;
              await existingUser.save();
            }
           return done(null, existingUser);
        }

        // If not found, create a new user
        const newUser = new User({
          googleId: profile.id,
          userName:profile.id,
          fullName: profile.displayName,
          email: profile.emails[0].value,
          profilePic: profile.photos[0].value
        });

        await newUser.save();
        return done(null, newUser);
      } catch (err) {
        return done(err, null);
      }
    }
  ));
};
