"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const helpers_1 = require("../../utils/helpers");
const userSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        default: `user_${(0, helpers_1.getRandomFourDigitNumber)()}`,
    },
    bio: {
        type: String,
        default: "",
    },
    phone: {
        type: String,
        default: "",
    },
    picture: {
        type: String,
        default: "",
    },
    googleId: {
        type: String,
        default: "",
    },
    createdAt: {
        type: mongoose_1.default.SchemaTypes.Date,
        required: true,
        default: new Date(),
    },
});
const User = mongoose_1.default.models.User || mongoose_1.default.model("User", userSchema);
exports.default = User;
