import {asyncHandler} from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/user.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import {ApiResponse} from '../utils/ApiResponse.js'
 
const registerUser =  asyncHandler(async (req,res) => {
  // steps for the user registration

  // get the data from the frontent 
  // validate the data , is empty (opitional : email format , password format , username unquienss) 
  // check is the user already exist
  // check for images , check for avatar
  // upload the files on to the cloudinary , avatar
  // create a user obj  - create entry to the database
  //remove the password and the refresh token from the user obj
  // check for user  creation
  // generate a res

 const {fullname , email , username, password } =  req.body
//  console.log("email:",email);

 if(
    [fullname , email , username, password].some( (field) => field?.trim() === "" )
 ){
        throw new ApiError(400 , "All fields are required")
 }

    // check for the user already exist
const existedUser = await User.findOne({
    $or: [{ email }, { username }]
});

// console.log(existedUser);

if(existedUser){
    throw new ApiError(409 , "User already exist")
}

// const avatarLocalPath = req.files?.avatar[0]?.path;
const avatarLocalPath = req.files?.avatar[0]?.path;
// const coverImageLocalPath =  req.files?.coverImage[0]?.path;

const coverImageLocalPath = null
if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
     coverImageLocalPath = req.files.coverImage[0].path
}

if(!avatarLocalPath){
    throw new ApiError(400 , "Avatar is required") 
}

const avatar = await uploadOnCloudinary(avatarLocalPath)
const coverImage =await uploadOnCloudinary(coverImageLocalPath)

if(!avatar) {
    throw new ApiError(500 , "Something went wrong while uploading the files")
}

const user = await User.create({
    fullname ,
    avatar : avatar.url,
    coverImage : coverImage?.url || "",
    email,
    password,
    username
})

const exsistedUser = await User.findById(user._id).select(
    "-password -refreshToken"
)


if(!exsistedUser){
    throw new ApiError(500 , "Something went wrong while creating the user")
}

res.status(201).json(
    new ApiResponse("User created successfully",200, exsistedUser)
)

})

export {registerUser}