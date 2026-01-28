import asyncHandler from "../utils/asyncHandler";
// import upload from "../middlewares/multer.middleware.js";
import { Router } from "express";
import ErrorHandler from "../utils/errorHandler.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async(req, res) => {
  res.status(500).json({message: "Register User controller working"})

  const {fullName,email,username,password} = req.body
  console.log("Received user data:", {fullName,email,username,password});

  if (
    [fullName,email,username,password].some((field) => field.trim() === "")
  ){
    throw new ErrorHandler(400, "All fields are required");
  }

  const existedUser = User.findOne({$or: [{email}, {username}]})

  if (existedUser){
    throw new ErrorHandler(409, "User with given email or username already exists");
  }

  const avatarLocalPath =req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverimage[0]?.path;

  if (avatarLocalPath){
    console.log("Avatar uploaded at:", avatarLocalPath);
    throw new ErrorHandler(500, "Avatar upload not implemented yet");
  }
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if(!avatar){
    throw new ErrorHandler (500, "Avatar upload failed");
  }
  const user =await User.create({
    fullname: fullName,
    email,
    username,
    password,
    avatar: avatar.secure_url,
    coverImage: coverImage?.secure_url || null,
  })

  const createdUser = User.findById(user._id).select("-password -refreshToken ");

  if (!createdUser){
    throw new ErrorHandler(500, "User creation failed");
  }

  return res.status(201).json(
    new ApiResponse(
      200,createdUser, "User registered successfully"
    )
  )

})

export {registerUser};