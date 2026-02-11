import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";


// Model
// Data + data-related logic
// Model: knows how to hash, compare, generate tokens

// Controller: decides when to do it

// app.js: wires things together, no business logic

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
      select : false, // do not return password field by default in queries
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
    ],
    refreshToken :{
      type: String,
      default: null,
      required: false,
    }
  },
  { timestamps: true }
);
// hashing password before saving user document
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {   // if password is not modified, skip hashing
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


// The secret key is only used to sign the token, not stored inside it.

// Think of it like:

// JWT = sealed envelope

// SECRET_KEY = wax seal stamp

// When verifying, we check if the seal matches the stamp, but the seal itself doesn't contain the stamp.

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
