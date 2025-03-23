
import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

})

const addComment = asyncHandler(async (req, res) => {
    // add a comment to a video
    const {videoId} = req.params
    const {comment} = req.body

    if(!isValidObjectId(videoId) || !comment) {
        throw new ApiError(400, "Video ID and comment is required")
    }

 const Comment = await  Comment.create({
    video : videoId,
    comment : comment,
    owner : req.user._id
   })

   if(!Comment) {
    throw new ApiError(500 , "Comment not added")
   }

   return res
   .status(200)
   .json(
    new ApiResponse(
        200 , Comment ,  "commented Successfully"
    )
   )
})

const updateComment = asyncHandler(async (req, res) => {
    // update a comment
    const {commentId, videoId} = req.params
    const {comment}  = req.body

    if(!isValidObjectId(commentId) || !newComment || !isValidObjectId(videoId)) {
        throw new ApiError(400 , "Comment ID , comment , videoId is is required")
    }

  const updatedComment =  await Comment.findByIdAndUpdate(
        {
            _id : commentId,
            video : videoId
        },
        {
           $set : {
               comment : comment
           }
        },
        {
            $new : true
        }
    )

    if(!updatedComment) {
        throw new ApiError(500 , "Comment not updated")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200 , updatedComment ,  "Comment updated Successfully"
        )
    )
})

const deleteComment = asyncHandler(async (req, res) => {
    // delete a comment
    const {commentId, videoId} = req.params

    if(!isValidObjectId(commentId) || !isValidObjectId(videoId)) {
        throw new ApiError(400 , "Comment ID and video ID is required")
    }

   await Comment.findOneAndDelete({
        _id : commentId,
    }
)

return res
.status(200)
.json(
    new ApiResponse(
        200 , {} , "Comment deleted Successfully"
)
)
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }
