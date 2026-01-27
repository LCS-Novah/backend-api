import { v2 as cloudinary } from "cloudinary";
import { log } from "console";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async(filepath)=>{
  try {
    if(!filepath){
      throw new Error("File path is required for upload")
      return null
    }
    const response = cloudinary.uploader.upload(filepath, {
      folder: "media",
      resource_type: "auto",
    });
    // file has been uploaded, now we can remove it from local storage
    console.log("File uploaded to Cloudinary:", response);
    return response;
  }catch(error){
    fs.unlink(filepath) // removing the file from local storage as the saved temporary file as the upload operation got failed
    return null
  }
}

export { uploadOnCloudinary };
