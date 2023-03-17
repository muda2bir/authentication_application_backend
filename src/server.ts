if (process.env.NODE_ENV !== "production") require("dotenv").config(); // * This is only going to import dotenv in the development
import cors from "cors";
import MongoStore from "connect-mongo";
import express from "express";
import session from "express-session";
import passport from "passport";
import "./strategies/google-auth"; // * Google Authentication Strategy
import "./strategies/local"; // * Local Authentication Strategy
import connectDB from "./database";
// * All the Routes
import { router as AuthenticationRouters } from "./routes/auth"; // * Authentication Router
import { router as UserRouter } from "./routes/user"; // * User Information Router
import { router as ImageRouter } from "./routes/image";
const app = express();
const PORT = process.env.PORT || 3001;
connectDB(); // * Securing Database Connection

app.set("trust proxy", 1);
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
); // TODO: Update the CORS_ORIGIN after the project deploys successfully!
app.use(express.json({ limit: "50mb" })); // * This is a middleware that will parse the json coming before sending the response
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET_KEY as string,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.DATABASE, // TODO: Update the DATABASE link after the project deploys successfully!
    }),
    cookie: { secure: true },
  })
); // * This is the session middleware

app.get("/", (req, res) => {
  res.json({ message: "welcome" });
});

// * Passport Initialization
app.use(passport.initialize());
app.use(passport.session());

// * Routes Configurations
app.use("/api/v1/authenticate", AuthenticationRouters);
app.use("/api/v1/user", UserRouter); // * Get user data when user is authenticated
app.use("/api/v1/image", ImageRouter); // Working with the images

app.listen(PORT);
