import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import jwt from 'jsonwebtoken'
import { User } from "../models/user.model.js"


export const validateJWT = asyncHandler( async (req,resizeBy, next) => 
    {
  try {
    const token  =  req.cookies?.accessToken || req.header
      ("authorization")?.replace("bearer ","")
  
      if(!token) {
          throw new ApiError(401 , "UnAuthorized request") 
      }
  
     const decodedToken =  jwt.verify(token , process.env.ACCESS_TOKEN_SECRET)
  
  const user =    User.findById(decodedToken.id).select("-password -refreshToken")
  
  req.user = user
  
    next()
  } catch (error) {
    throw new ApiError(401 , error?.message || "UnAuthorized request")
  }
    
}) 