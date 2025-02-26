import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const generateRefreshAndAccessTokens = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, "user does not exist");
    }

    const accessToken = user.generateAccesstToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    // this means , didnot need to check anything , just save it
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "something went wrong while genearting refesh and access tokens"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
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

  const { fullname, email, username, password } = req.body;
  //  console.log("email:",email);

  if (
    [fullname, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // check for the user already exist
  const existedUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  // console.log(existedUser);

  if (existedUser) {
    throw new ApiError(409, "User already exist");
  }

  // const avatarLocalPath = req.files?.avatar[0]?.path;
  const avatarLocalPath = req.files?.avatar[0]?.path;
  // const coverImageLocalPath =  req.files?.coverImage[0]?.path;

  const coverImageLocalPath = null;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(500, "Something went wrong while uploading the files");
  }

  const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username,
  });

  const exsistedUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!exsistedUser) {
    throw new ApiError(500, "Something went wrong while creating the user");
  }

  res
    .status(201)
    .json(new ApiResponse("User created successfully", 200, exsistedUser));
});

const loginUser = asyncHandler(async (req, res) => {
  // get the req.body => data
  // check whether the user or the email exists
  // check the password
  // generate refresh and access tokens
  // send the res

  const { username, email, password } = req.body;

  if (!(username || email)) {
    throw new ApiError(400, "Username or email is required");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "username or password does not exist ");
  }

  const isPasswordValidate = user.matchpassword(password);

  if (!isPasswordValidate) {
    throw new ApiError(401, "username or password does not exist ");
  }

  const { accessToken, refreshToken } = await generateRefreshAndAccessTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, refreshToken, accessToken },
        "User LoggedIn Successfully"
      )
    );
});

const loggoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { refreshToken: undefined },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "user logout successfully"));
});

const RefreshAccessToken = asyncHandler(async (req, res) => {
  const token = req.coookies.refreshToken || req.body.refreshToken;

  if (!token) {
    throw new ApiError(401, "UnAuthorized request");
  }

  const decodedToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

  if (!decodedToken) {
    throw new ApiError(401, "invalid refresh Token");
  }

  const user = User.findById(decodedToken._id);

  if (!user) {
    throw new ApiError(401, "couldnot find a user");
  }

  if (decodedToken !== user?.refreshToken) {
    throw new ApiError(401, "Invalid Refresh Token");
  }

  const { accessToken, newRefreshToken } = await generateRefreshAndAccessTokens(
    user._id
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", newRefreshToken, options)
    .json(
      new ApiResponse(
        200,
        { accessToken, newRefreshToken },
        "new access token generated successfully"
      )
    );
});

const updatePassword = asyncHandler(async (req, res) => {
  const { oldPasssword, newPassword } = req.body;
  const user = await User.findById(req.user._id);

  if(!user) {
    throw new ApiError(401, "user doesnot exsit")
  }

  const passwordValidation =  user.matchpassword(oldPasssword);

  if(!passwordValidation) {
    throw new ApiError(401 , "Entered password is incorrect")
  }

  user.password = newPassword

 await user.save({validateBeforeSave : false})

 return res
 .status(200)
 .json(
    new ApiResponse(
        200, 
        {},
        "password updated successfully"
    )
 )
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
  .status(200)
  .json(
    new ApiResponse(
        200, 
        req.user,
        "user details fetched successfully"
    )
  )
})

const updateUserAccountDetails = asyncHandler(async (req,res) => {
   const {fullname , email} = req.body

   if(!fullname || !email) {
    throw new ApiError(400, "fullname and email is required")
   }
 
const user = await User.findByIdAndUpdate(
    req.user?._id ,
    {
        $set : {
            fullname ,
            email : email
        } 
    } ,
    {
        new : true
    }   
).select("-password")

return res
.status(200)
.json(
    new ApiResponse(
        200,
        {user},
        "fullname and email updated successfully"
    )
)


}) 

const upadeUserAvatar = asyncHandler(async (req, res) => {

   const  updatedAvatarLocalPath =  req.file?.path

   if(!updatedAvatarLocalPath.url) {
    throw new ApiError(400, "avatar is required")
   }

 const user =  await User.findByIdAndUpdate(
    req.user?._id ,
    {
      $set : {
        avatar : updatedAvatarLocalPath.url
      }
    },
    {
      new: true
    }
   ) .select("-password")

   return res
   .status(200)
   .json(
    new ApiResponse(
      200 ,
      {user} ,
      "Avatar Updated Successfully"
    )
   )
})

const upadeUserCoverImage = asyncHandler(async (req, res) => {
   

   const  updatedCoverImageLocalPath =  req.file?.path

   if(!updatedCoverImageLocalPath.url) {
    throw new ApiError(400, "coverImage is required")
   }

 const user =  await User.findByIdAndUpdate(
    req.user?._id ,
    {
      $set : {
        coverImage : updatedCoverImageLocalPath.url
      }
    },
    {
      new: true
    }
   ) .select("-password")

   return res
   .status(200)
   .json(
    new ApiResponse(
      200 ,
      {user} ,
      "Avatar Updated Successfully"
    )
   )
})





export { 
    registerUser, 
    loginUser,
     loggoutUser, 
     RefreshAccessToken ,
     updatePassword ,
     getCurrentUser ,
     updateUserAccountDetails,
     upadeUserAvatar,
     upadeUserCoverImage
    
    };
