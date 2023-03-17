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
const user_auth_1 = __importDefault(require("../middleware/user-auth"));
exports.router = (0, express_1.Router)();
const user_1 = __importDefault(require("../database/Schemas/user"));
const helpers_1 = require("../utils/helpers");
exports.router.get("/", user_auth_1.default, (req, res) => {
    res.json({
        status: "ok",
        message: "User is authenticated!",
        user: req.user,
    });
});
exports.router.put("/update", user_auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.user) {
            const { _id } = req.user;
            let userData = req.body;
            delete userData.id; // deleting the id from the userObject
            if (userData.password.length === 60) {
                yield user_1.default.findByIdAndUpdate({ _id }, {
                    $set: userData,
                });
            }
            else {
                const hashedPassword = (0, helpers_1.hashPassword)(userData.password);
                userData.password = hashedPassword;
                yield user_1.default.findByIdAndUpdate({ _id }, {
                    $set: userData,
                });
            }
        }
        res.json({ status: "ok", message: "User data updated Successfully!" });
    }
    catch (error) {
        res.json({ status: "error", message: "Something went wrong!" });
    }
}));
