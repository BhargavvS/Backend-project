import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //create tweet
    const {content} = req.body    
    if(!!content) {
        throw new ApiError(400, "Tweet is required")
    }

    const newTweet = await Tweet.create({
        content,
        owner: req.user._id
    })
    if(!newTweet) {
        throw new ApiError(500, "Tweet not created")
    }

    return res 
    .status(200)
    .json(
        new ApiResponse(
            200, newTweet, "Tweet created successfully"
        )
    )
})

const getUserTweets = asyncHandler(async (req, res) => {
    // get user tweets
    const {userId} = req.params
    if(!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid User ID")
    }

const allUserTweet = await Tweet.aggregate(
        [
            {
                $match: {
                    owner : userId
                }
            },
            {
                $project : {
                    content : 1,
                    owner : 1
                }
            }
        ]
    )

    if(!allUserTweet) {
        throw new ApiError(500, "No tweets found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200 , allUserTweet , "All user tweets fetched successfully"
        )
    )
})

const updateTweet = asyncHandler(async (req, res) => {
    //update tweet
    const {tweetId} = req.params
    if(!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid Tweet ID")
    }
    const {content} = req.body

    if(!content) {
        throw new ApiError(400, "Tweet content is required")
    }

const updtaedTweet = await Tweet.findByIdAndUpdate(
        {
            _id : tweetId,
            owner : req.user._id
        },
        {
            $set: {
                content : content
            }
        },
        {
            new : true
        }
    )

    if(!updtaedTweet) {
        throw new ApiError(500, "Tweet not updated")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200 , updtaedTweet , "Tweet updated successfully"
        )
    )
})

const deleteTweet = asyncHandler(async (req, res) => {
    //delete tweet
    const {tweetId}  = req.params
    if(isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid Tweet ID")
    }

     await Tweet.findByIdAndDelete(tweetId)(
        {
            _id : tweetId,
            owner : req.user._id
        }
    )

    return res
    .status(200)
    .json(
        new ApiResponse(
            200 , {} , "Tweet deleted successfully"
        )
    )
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}