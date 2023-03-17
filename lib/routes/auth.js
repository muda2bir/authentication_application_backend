"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const user_1 = __importDefault(require("../database/Schemas/user"));
const helpers_1 = require("../utils/helpers");
exports.router = (0, express_1.Router)();
// * Authenticating a User
exports.router.post("/login", passport_1.default.authenticate("local"), (req, res) => {
    res.json({
        status: "ok",
        message: "User Logged In Successfully!",
        user: req.user,
    });
});
// * Logging out the user
exports.router.post("/logout", (req, res, next) => {
    try {
        req.logout(function (err) {
            if (err) {
                return next(err);
            }
        });
    }
    catch (err) {
        if (err instanceof Error) {
            return res.json({ status: "error", message: err.message });
        }
    }
});
// * Registering a User
exports.router.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password)
        return res.json({
            status: "error",
            message: "Please fill all the details",
        });
    try {
        const theUser = yield user_1.default.findOne({ email });
        if (theUser)
            return res.json({ status: "error", message: "User Already Exits!!" });
        const hashedPassword = (0, helpers_1.hashPassword)(password);
        let newUser = new user_1.default({ email, password: hashedPassword });
        yield newUser.save();
        return res.json({ status: "ok", message: "User Registered Successfully!" });
    }
    catch (err) {
        return res.json({ status: "error", message: err });
    }
}));
// * Google Authentication
exports.router.get("/login/google", passport_1.default.authenticate("google", { scope: ["profile", "email"] }));
exports.router.get("/auth/google/callback", passport_1.default.authenticate("google", {
    failureRedirect: process.env.FAILURE_LOGIN_URL,
    successRedirect: process.env.SUCCESS_LOGIN_URL,
}), (req, res) => {
    res.send("Authentication process completed!");
});
