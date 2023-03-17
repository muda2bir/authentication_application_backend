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
const passport_local_1 = require("passport-local");
const passport_1 = __importDefault(require("passport"));
const user_1 = __importDefault(require("../database/Schemas/user"));
const helpers_1 = require("../utils/helpers");
passport_1.default.serializeUser((user, done) => done(null, user._id)); // Serializing User
passport_1.default.deserializeUser((_id, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.default.findById({ _id });
        if (!user)
            return done(new Error("User not found!"), undefined);
        return done(null, user);
    }
    catch (err) {
        return done(err, undefined);
    }
})); // Deserializing User
passport_1.default.use(new passport_local_1.Strategy({ usernameField: "email" }, (email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    if (!email || !password) {
        done(new Error("Please fill all the details!"), undefined);
    }
    try {
        const theUser = yield user_1.default.findOne({ email });
        if (!theUser)
            return done(new Error("User does not exits!"), undefined);
        let isValid = (0, helpers_1.compareHash)(theUser.password, password);
        if (!isValid)
            return done(new Error("Invalid Credentials!"), undefined);
        done(null, theUser);
    }
    catch (error) {
        if (error instanceof Error) {
            return done(error, undefined);
        }
    }
})));
