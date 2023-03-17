import { Router } from "express";
import passport from "passport";
import User from "../database/Schemas/user";
import { hashPassword } from "../utils/helpers";
export const router = Router();

// * Authenticating a User
router.post("/login", passport.authenticate("local"), (req, res) => {
  res.json({
    status: "ok",
    message: "User Logged In Successfully!",
    user: req.user,
  });
});

// * Logging out the user
router.post("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) return res.json({ status: "error", message: err });
    return res.json({ status: "ok", message: "User logged out successfully" });
  });
});

// * Registering a User
router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.json({
      status: "error",
      message: "Please fill all the details",
    });
  try {
    const theUser = await User.findOne({ email });
    if (theUser)
      return res.json({ status: "error", message: "User Already Exits!!" });

    const hashedPassword = hashPassword(password);
    let newUser = new User({ email, password: hashedPassword });
    await newUser.save();
    return res.json({ status: "ok", message: "User Registered Successfully!" });
  } catch (err) {
    return res.json({ status: "error", message: err });
  }
});

// * Google Authentication
router.get(
  "/login/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: process.env.FAILURE_LOGIN_URL,
    successRedirect: process.env.SUCCESS_LOGIN_URL,
  }),
  (req, res) => {
    res.send("Authentication process completed!");
  }
);
