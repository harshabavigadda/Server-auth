import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  otp: {type: String},
  otpexpiry: {type: Date}
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("user", userSchema);

export { User };
