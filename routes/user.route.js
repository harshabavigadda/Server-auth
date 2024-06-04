import { Router } from "express";
import {
  userLogin,
  userRegister,
  userDashboard,
  userLogout,
  sendMail,
  resetPassword,
} from "../controllers/user.controller.js";
import { verifyUser } from "../middlewares/user.middlewares.js";

const router = Router();

router.post("/login", userLogin);
router.post("/register", userRegister);
router.get("/dashboard", verifyUser, userDashboard);
router.post("/dashboard", userLogout);
router.post("/forgot-password", sendMail);
router.post("/password-change", resetPassword);

export { router };
