import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose , {Schema} from "mongoose";
import { json } from "express";

const getAllVideos = asyncHandler(async (req,res) => {
    const { page = 1 , limit = 10 , query , sortBy , sortType , userId}  = req.query
    // get all video based on query , sort and paginate
       
} )

const publishAVideo =asyncHandler(async (req,res) => {
    // get a video , upload to the cloudinary , create a video
    const {title , description } = req.body
})

const getVideoById = asyncHandler(async (req, res)=> {
    const {videoId} = req.params

    if(!videoId) {
        throw new ApiError(400 , "videoId is required")
    }

  const video = await Video.findById({_id : videoId})

  if(!video) {
    throw new ApiError(500 , "can't find the video")
  }

  return res
  .status(200)
  .json(
    new ApiResponse(
        200 , video , "video fetched successfully"
    )
  )
})

const updateVideo = asyncHandler(async (req, res) => {

    const {videoId } = req.params
    if(!videoId){
        throw new ApiError(400 , "videoId is required")
    }

    const {title , description , thumbnail} = req.body

    if(!title || !description || !thumbnail) {
        throw new ApiError(400 , "title , description , thumbnail is required")
    }

  const video =  await Video.findByIdAndUpdate(
        {
            _id : videoId
        },
        {
            $set : {
                title : title,
                description : description,
                thumbnail : thumbnail
            },
        },
        {
            new : true
        }
    )

    return res
    .status(200),
    json(
        new ApiResponse(
            200 , 
            video ,
            "updated successfully"
        )
    )
})

const deleteAvideo = asyncHandler(async (req,res) => {
    const {videoId} = req.params
    // delete the video using the videoId
})

const togglePublishStatus = asyncHandler(async (req,res) => {
    const { videoId } = req.params
    if(!videoId) {
        throw new ApiError(400 , "videoId is required")
    }

  const video =  await Video.findByIdAndUpdate(
        {
            _id : videoId
        },
        {
            $set : {
                isPublished 
            }
        },
        {
            new :true
        }
    )

    return res
    .status(200)
    .json(
        new ApiResponse(
            200 ,
            video ,
            "publish toggled successfully"
        )
    )
})



export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteAvideo,
    togglePublishStatus
}