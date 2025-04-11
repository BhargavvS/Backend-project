import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    //  Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    
const allUserVideos = await Video.aggregate(
        [
            {
                $match:{
                    owner : req.user._id
                }
            },
            {
                $addFields: {
                    totalViews: {
                        $size : "$views"
                    },
                    totalSubcribers: {
                        $lookup:{
                            from : "users",
                            localField : "owner",
                            foreignField : "_id",
                            as : "subscribers"
                        },
                        pipleline : [
                            {
                                $project : {
                                    subscriberCount : 1
                                }
                            }
                        ]
                    },
                    totalVideos: {
                        $count: {}
                    }
                }
            }
        ]
    )
    
const totalLikes = await Like.aggregate(
    [
        {
            $match:{
                owner : req.user._id
            }
        },
        {
            $count: {}
        }
    ]
)

return res
.status(200)
.json(
    new ApiResponse(
        200 , {allUserVideos , totalLikes} ,  "Channel Stats fetched successfully"
    )
)

})

const getChannelVideos = asyncHandler(async (req, res) => {
    // Get all the videos uploaded by the channel
})

export {
    getChannelStats, 
    getChannelVideos
    }