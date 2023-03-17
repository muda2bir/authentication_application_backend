import { Strategy as LocalStrategy } from "passport-local";
import passport from "passport";
import User from "../database/Schemas/user";
import { compareHash } from "../utils/helpers";

passport.serializeUser((user: any, done) => done(null, user._id)); // Serializing User
passport.deserializeUser(async (_id, done) => {
  try {
    const user = await User.findById({ _id });
    if (!user) return done(new Error("User not found!"), undefined);
    return done(null, user);
  } catch (err) {
    return done(err, undefined);
  }
}); // Deserializing User

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      if (!email || !password) {
        done(new Error("Please fill all the details!"), undefined);
      }
      try {
        const theUser = await User.findOne({ email });
        if (!theUser) return done(new Error("User does not exits!"), undefined);
        let isValid = compareHash(theUser.password, password);
        if (!isValid) return done(new Error("Invalid Credentials!"), undefined);
        done(null, theUser);
      } catch (error) {
        if (error instanceof Error) {
          return done(error, undefined);
        }
      }
    }
  )
);
