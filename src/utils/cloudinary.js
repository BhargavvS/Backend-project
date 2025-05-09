import {v2 as Cloudinary} from "cloudinary"
import fs from "fs"
import { ApiError } from "./ApiError.js";

Cloudinary.config({
cloud_name	: process.env.CLOUDINARY_CLOUD_NAME,
api_key	 : process.env.CLOUDINARY_API_KEY,
api_secret	: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary  = async (localFilePath) => {

    try {
        if(!localFilePath) return null

        // upload the file on tyhe cloudinary
       const response = await Cloudinary.uploader.upload(localFilePath , {
            resource_type: "auto"
        })

        // after uploading delink the file
        // file has been uploaded successfull
        // console.log("file is uploaded on cloudinary ", response.url);
        fs.unlinkSync(localFilePath)
        return response
        
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        fs.unlinkSync(localFilePath)
        return null 
    }


}

// const deleteFromClodinary = async (imagePublicId) => {
//     try {

//         const response =    await Cloudinary.uploader.destroy(imagePublicId , {
//             resource_type : "auto"
//         })

//         return "deleted successfully"


//     } catch (error) {
//         console.error('Error while deleting  from Cloudinary:', error);
//         return null
//     }
// }

export {uploadOnCloudinary}