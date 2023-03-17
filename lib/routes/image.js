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
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const { cloudinary } = require("../utils/cloudinary");
exports.router = (0, express_1.Router)();
exports.router.post("/upload", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fileStr = req.body.data;
        const uploadedResponse = yield cloudinary.uploader.upload(fileStr, {
            upload_preset: "authentication_application",
        });
        return res.json({
            status: "ok",
            message: "Image Uploaded Successfully!",
            image_url: uploadedResponse.secure_url,
        });
    }
    catch (error) {
        return res.json({ status: "error", message: error });
    }
}));
