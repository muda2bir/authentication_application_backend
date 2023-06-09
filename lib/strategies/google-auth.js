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
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const user_1 = __importDefault(require("../database/Schemas/user"));
const helpers_1 = require("../utils/helpers");
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    scope: ["profile", "email"],
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    try {
        const theUser = yield user_1.default.findOne({
            email: (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0].value,
        });
        if (!theUser) {
            const hashedPassword = yield (0, helpers_1.hashPassword)(process.env.DEFAULT_PASSWORD);
            const newUser = new user_1.default({
                name: `${(_b = profile.name) === null || _b === void 0 ? void 0 : _b.givenName} ${(_c = profile.name) === null || _c === void 0 ? void 0 : _c.familyName}`,
                googleId: profile.id,
                email: (_d = profile.emails) === null || _d === void 0 ? void 0 : _d[0].value,
                picture: (_e = profile.photos) === null || _e === void 0 ? void 0 : _e[0].value,
                password: hashedPassword,
            });
            newUser.save();
            return done(null, newUser);
        }
        if (theUser.googleId !== "")
            return done(null, theUser);
        yield user_1.default.updateOne({ email: (_f = profile.emails) === null || _f === void 0 ? void 0 : _f[0].value }, { $set: { googleId: profile.id } });
        return done(null, theUser);
    }
    catch (err) {
        if (err instanceof Error) {
            return done(err, undefined);
        }
    }
})));
passport_1.default.serializeUser((user, done) => {
    return done(null, user.id);
});
passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const theUser = yield user_1.default.findOne({ _id: id });
        if (!theUser)
            done(new Error("User not found!"), undefined);
        return done(null, theUser);
    }
    catch (error) {
        return done(error, undefined);
    }
}));
