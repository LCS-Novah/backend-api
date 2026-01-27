import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";


const userSchema = new Schema(
  {
    username:{
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    email:{
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    fullname:{
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    password:{
      type: String,
      required: true,
    },
    avatar:{
      type: String,
      default: null,
      required: false,
    },
    coverImage:{
      type: String,
      default: null,
      required: false,
    },
    watchHistory :[{
      type: Schema.Types.ObjectId,
      ref : 'Video',
    } 
    ]
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.isPasswordCorrect = async function (Password) {
  return await bcrypt.compare(Password, this.password);
}

userSchema.methods.generateAcesssToken = function () {
  return jwt.sign(
    { userId: this._id, username: this.username , fullname: this.fullname,
    email: this.email ,
    },
    process.env.ACESS_TOKEN_SECRET,
    { expiresIn: "1d" }
  );
}

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { 
      userId: this._id, 
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
}

export const User = mongoose.model("User", userSchema);
