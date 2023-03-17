"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
if (process.env.NODE_ENV !== "production")
    require("dotenv").config(); // * This is only going to import dotenv in the development
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const connect_mongodb_session_1 = __importDefault(require("connect-mongodb-session"));
const uuid_1 = require("uuid");
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
require("./strategies/google-auth"); // * Google Authentication Strategy
require("./strategies/local"); // * Local Authentication Strategy
const database_1 = __importDefault(require("./database"));
// * All the Routes
const auth_1 = require("./routes/auth"); // * Authentication Router
const user_1 = require("./routes/user"); // * User Information Router
const image_1 = require("./routes/image");
const mongoStore = (0, connect_mongodb_session_1.default)(express_session_1.default); // * Initializing the store to save the sessions
const store = new mongoStore({
    collection: "userSessions",
    uri: process.env.DATABASE,
    expires: 604800000,
});
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
(0, database_1.default)(); // * Securing Database Connection
if (process.env.NODE_ENV === "production")
    app.set("trust proxy", 1);
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
})); // TODO: Update the CORS_ORIGIN after the project deploys successfully!
app.use(express_1.default.json({ limit: "50mb" })); // * This is a middleware that will parse the json coming before sending the response
app.use(express_1.default.urlencoded({ limit: "50mb", extended: true }));
app.use((0, express_session_1.default)({
    genid: function () {
        return (0, uuid_1.v4)();
    },
    name: "authId",
    secret: process.env.SESSION_SECRET_KEY,
    store: store,
    resave: false,
    saveUninitialized: false,
    cookie: {
        sameSite: false,
        secure: process.env.NODE_ENV === "production",
        maxAge: 604800000,
        httpOnly: true,
    },
})); // * This is the session middleware
app.get("/", (req, res) => {
    res.json({ message: "welcome" });
});
// * Passport Initialization
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
// * Routes Configurations
app.use("/api/v1/authenticate", auth_1.router);
app.use("/api/v1/user", user_1.router); // * Get user data when user is authenticated
app.use("/api/v1/image", image_1.router); // Working with the images
app.listen(PORT);
