"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareHash = exports.hashPassword = exports.getRandomFourDigitNumber = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
function getRandomFourDigitNumber() {
    return Math.floor(1000 + Math.random() * 9000);
}
exports.getRandomFourDigitNumber = getRandomFourDigitNumber;
function hashPassword(password) {
    const hashedPassword = bcrypt_1.default.hashSync(password, 10);
    return hashedPassword;
}
exports.hashPassword = hashPassword;
function compareHash(hash, rawPassword) {
    const passwordComparison = bcrypt_1.default.compareSync(rawPassword, hash);
    return passwordComparison;
}
exports.compareHash = compareHash;
