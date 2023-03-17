import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../database/Schemas/user";
import { hashPassword } from "../utils/helpers";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const theUser = await User.findOne({ googleId: profile.id });
        if (!theUser) {
          const hashedPassword = await hashPassword(
            process.env.DEFAULT_PASSWORD as string
          );
          const newUser = new User({
            name: `${profile.name?.givenName} ${profile.name?.familyName}`,
            googleId: profile.id,
            email: profile.emails?.[0].value,
            picture: profile.photos?.[0].value,
            password: hashedPassword,
          });
          newUser.save();
          return done(null, newUser);
        }
        return done(null, theUser);
      } catch (err) {
        if (err instanceof Error) {
          return done(err, undefined);
        }
      }
    }
  )
);

passport.serializeUser((user, done) => {
  return done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const theUser = await User.findOne({ _id: id });
    if (!theUser) done(new Error("User not found!"), undefined);
    return done(null, theUser);
  } catch (error) {
    return done(error, undefined);
  }
});
