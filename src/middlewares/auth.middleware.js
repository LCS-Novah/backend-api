import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../config.js';
import ErrorHandler from '../utils/errorHandler.js';
import asyncHandler from '../utils/asyncHandler.js';
import { User } from '../models/user.model.js';

const authMiddleware = asyncHandler(async (req,res,next)=>{
  const token = req.cookies?.accessToken || req.headers?.authorization?.replace("Bearer ", ""); // what this line is doing is that it is checking if there is an access token in the cookies, if there is then it will use that token, if there is no access token in the cookies then it will check if there is an access token in the headers, if there is then it will use that token, if there is no access token in the headers then it will throw an error saying that access token is missing

  // this is for development purposes, in production we should always use access token in cookies bucz it is more secure and less vulnerable to XSS attacks, but for testing with tools like Postman, we can allow access token in headers as well

  if (!token){
    throw new ErrorHandler(401, "Access token is missing");
  }

  let decoded;

try {
  decoded = jwt.verify(token, SECRET_KEY);
} catch (error) {
  throw new ErrorHandler(401, "Invalid or expired access token");
}

  const user = await User.findById(decoded.userId).select("-password -refreshToken");  // this line is finding the user by id and then selecting all the fields except password and refreshToken, this is done to prevent sending sensitive information to the client ,, and it is done by using the select method of mongoose which allows us to specify which fields we want to include or exclude in the result, in this case we are excluding password and refreshToken by using -password and -refreshToken

  // here decoded.userId is the userId that we have stored in the access token when we created it, so when we verify the token, we get the decoded payload which contains the userId and then we can use that userId to find the user in the database
 

  if (!user){
    throw new ErrorHandler(401, "Invalid access token");
  }
  req.user = user;
  next();
})

export default authMiddleware;



// Middleware either:

// Ends request → res.json() / throw error
// OR

// Calls next() → passes control forward