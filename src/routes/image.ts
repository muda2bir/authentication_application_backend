import { Router } from "express";
const { cloudinary } = require("../utils/cloudinary");
export const router = Router();

router.post("/upload", async (req, res) => {
  try {
    const fileStr = req.body.data;
    const uploadedResponse = await cloudinary.uploader.upload(fileStr, {
      upload_preset: "authentication_application",
    });
    return res.json({
      status: "ok",
      message: "Image Uploaded Successfully!",
      image_url: uploadedResponse.secure_url,
    });
  } catch (error) {
    return res.json({ status: "error", message: error });
  }
});
