import { User } from "../models/user.model.js";
import nodemailer from "nodemailer";
import crypto from "crypto";
import jwt from "jsonwebtoken";

const userLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ access: false, data: "Give all data" });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.json({
      access: false,
      data: "User Not registered",
    });
  }

  const passverify = await user.isPasswordCorrect(password);

  if (!passverify) {
    return res.json({
      access: false,
      data: "Password is incorrect",
    });
  }

  const accessToken = jwt.sign({ email }, process.env.ACCESS_TOKEN_KEY, {
    expiresIn: "1m",
  });

  const refreshToken = jwt.sign({ email }, process.env.REFRESH_TOKEN_KEY, {
    expiresIn: "5m",
  });

  // console.log(accessToken);
  return res
    .cookie("accessToken", accessToken, {
      maxAge: 60000,
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    })
    .cookie("refreshToken", refreshToken, {
      maxAge: 300000,
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    })
    .json({
      access: true,
      data: "Successfully Logged in",
    });
};

const userRegister = async (req, res) => {
  const { userName, email, password } = req.body;

  if (!userName || !email || !password) {
    return res.json({ success: false, data: "Give All Data" });
  }

  const userexist = await User.findOne({ email });

  if (userexist) {
    return res.json({
      success: false,
      data: "User already registered please Login",
    });
  }

  try {
    await User.create({ userName, email, password })
      .then((result) => {
        // console.log(result)
        res.status(200).json({ success: true, data: result });
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    res.json({ success: false, error: error });
  }
};

const userDashboard = (req, res) => {
  // console.log(req);
  res.json({ login: true });
};

const userLogout = (req, res) => {
  const { message } = req.body;

  if (message == "Logout") {
    return res
      .clearCookie("accessToken")
      .clearCookie("refreshToken")
      .json({ success: true, data: "Successfully Logged Out" });
  }

  return res.json({ success: false, data: "Error in Logout" });
};

const sendMail = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, data: "User not found" });
    }

    const otp = crypto.randomInt(100000, 999999).toString();

    user.otp = otp;
    user.otpexpiry = Date.now() + 10 * 60 * 1000;

    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is ${otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.json({ success: false, data: "Failed to send email" });
      }

      res.json({ success: true, data: "OTP sent to your email" });
    });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};

const resetPassword = async (req, res) => {
  const { email, otp, newpassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, data: "User not found" });
    }

    if (user.otp !== otp || user.otpexpiry < Date.now()) {
      return res.json({ success: false, data: "Invalid or expired OTP" });
    }

    user.password = newpassword;
    user.otp = undefined;
    user.otpexpiry = undefined;

    await user.save();

    res.json({ success: true, data: "Password reset successful" });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};

export {
  userLogin,
  userRegister,
  userDashboard,
  sendMail,
  resetPassword,
  userLogout,
};
