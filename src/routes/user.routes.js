import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import upload from "../middlewares/multer.middleware.js";

// Route
// URL mapping

const router = Router();

router.route("/register").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverimage", maxCount: 5 },
  ]),
  registerUser
)