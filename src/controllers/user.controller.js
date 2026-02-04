import asyncHandler from "../utils/asyncHandler";
// import upload from "../middlewares/multer.middleware.js";
import { Router } from "express";
import ErrorHandler from "../utils/errorHandler.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";

// Controller used for
// Request handling 

// Login = authentication (who you are)
// Middleware = authorization (are you allowed now)

const registerUser = asyncHandler(async(req, res) => {
  res.status(500).json({message: "User registration not implemented yet"}); 

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
  console.log("Avatar local path:", req.files?.avatar[0]);
  const coverImageLocalPath = req.files?.coverimage[0]?.path;

  if (!avatarLocalPath){
    console.log("Avatar uploaded at:", avatarLocalPath);
    throw new ErrorHandler(500, "Avatar upload not implemented yet");
  }
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if(!avatar){
    throw new ErrorHandler (500, "Avatar upload failed");
  }
  const user = await User.create({ // creating user in the database, passes data to mongoose model and model handles db insertion
    fullname: fullName,
    email,
    username,
    password,
    avatar: avatar.secure_url,
    coverImage: coverImage?.secure_url || null,
  });

  const accessToken = user.generateAuthToken(); // generating access token for the user
  const refreshToken = user.generateRefreshToken(); // generating refresh token for the user

  res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, 
      })
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,

      })
      .json(
        new ApiResponse(
          200,
          {
            accessToken,
            user: {
              _id: user._id,
              fullname: user.fullname,
              username: user.username,
              email: user.email,
              avatar: user.avatar,
              coverImage: user.coverImage,
            },
          },
          "User registered successfully"
        )
      );

      user.refreshToken = refreshToken;
      await user.save();

  const createdUser = await User.findById(user._id).select("-password -refreshToken");


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