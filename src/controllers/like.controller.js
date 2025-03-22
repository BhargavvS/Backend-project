import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //toggle like on video
    if(!isValidObjectId(videoId)) {
        throw new ApiError(400, "Video ID is required")
    }

  const existingLike =  await Like.findOne( {
        video : videoId,
        likedBy : req.user._id
    })

    if(existingLike)  {
       await Like.findByIdAndDelete(existingLike._id)
       return res
       .status(200)
       .json(
        new ApiResponse(
            200 , {} , "Unliked the video Successfully"
        )
       )
    }

    else { 
    const newLike = await Like.create({
            video : videoId,
            likedBy : req.user._id
        })

    return res
    .status(200)
    .json(
        new ApiResponse(
            200 , newLike ,  "Liked The video sucessfully"
        )
    )
    }
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //toggle like on comment

    if(!isValidObjectId(commentId)) {
        throw new ApiError(400 , "Comment ID is required")
    }

  const commentLike  =  await Like.findOne({
        comment : commentId,
        likedBy : req.user._id
    })

    if(commentLike) {
        await Like.findByIdAndDelete(commentLike._id)
        return res
        .status(200)
        .json(
         new ApiResponse(
             200 , {} , "Unliked the Comment Successfully"
         )
        )
    }

    else { 
       const newCommentLike = await Like.create(
           { comment : commentId,
            likedBy : req.user._id}
        )

        return res
        .status(200)
        .json(
            new ApiResponse(
                200 , newCommentLike ,  "Liked The comment sucessfully"
            )
        )
    }
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //toggle like on tweet
    if(!isValidObjectId(tweetId)) {
        throw new ApiError(400 , "tweetId is required")
    }

  const tweetLike  =  await Like.findOne({
    tweet : tweetId,
        likedBy : req.user._id
    })

    if(tweetLike) {
        await Like.findByIdAndDelete(tweetLike._id)
        return res
        .status(200)
        .json(
         new ApiResponse(
             200 , {} , "Unliked the tweet Successfully"
         )
        )
    }

    else { 
       const newtweetLike = await Like.create(
           { tweet : commentId,
            likedBy : req.user._id}
        )

        return res
        .status(200)
        .json(
            new ApiResponse(
                200 , newtweetLike ,  "Liked The tweet sucessfully"
            )
        )
    }
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //get all liked videos
    const likedVideos =  await Like.aggregate( [
        {
            $match : {
                likedBy : req.user._id
            },
        },
        {
            $lookup : {
                from : "videos",
                localField : "video",
                foreignField : "_id",
                as : "video"
            } 
        },
        {
            $first : "$video"
        },
        {
            $project : {
                _id : 1 ,
                title : 1,
                description : 1,
                url : 1,
                thumbnail : 1,
                likedBy : 1,
                duration : 1,
                views : 1
            }
        }
    
    ])

    if(!likedVideos)  {
        throw new ApiError(500 , "No liked videos found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200 , likedVideos , "Liked Videos Fetched Successfully"
    )
)
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}