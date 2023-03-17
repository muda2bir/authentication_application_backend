import { Router } from "express";
import isUserAuthenticated from "../middleware/user-auth";
export const router = Router();
import User from "../database/Schemas/user";
import { hashPassword } from "../utils/helpers";

router.get("/", isUserAuthenticated, (req, res) => {
  res.json({
    status: "ok",
    message: "User is authenticated!",
    user: req.user,
  });
});

router.put("/update", isUserAuthenticated, async (req, res) => {
  try {
    if (req.user) {
      const { _id } = req.user;
      let userData = req.body;
      delete userData.id; // deleting the id from the userObject
      if (userData.password.length === 60) {
        await User.findByIdAndUpdate(
          { _id },
          {
            $set: userData,
          }
        );
      } else {
        const hashedPassword = hashPassword(userData.password);
        userData.password = hashedPassword;
        await User.findByIdAndUpdate(
          { _id },
          {
            $set: userData,
          }
        );
      }
    }
    res.json({ status: "ok", message: "User data updated Successfully!" });
  } catch (error) {
    res.json({ status: "error", message: "Something went wrong!" });
  }
});
