import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // toggle subscription

    if(!isValidObjectId(channelId)) {
        throw new ApiError(400, "Channel ID is required")
    }

  const subscribed = await  Subscription.findOne({
        channel : channelId,
        subscriber : req.User._id
    })

    if(subscribed) {
       try {
        await Subscription.findByIdAndDelete(subscribed._id)

        return res
        .status(200)
        .json(
            new ApiResponse(
                200 , {} , "Unsubscribed the channel sucessfully"
            )
        )
       } catch (error) {
              throw new ApiError(500, "Subscription not removed")
       }
    }

    if(!subscribed) {
         const newSubscription =   await Subscription.create(
               { subscriber : req.User._id,
                channel : channelId}
            )
        
            if(!newSubscription) {
                throw new ApiError(500 , "Unsucessful Subscription")
            }

            return res
            .status(200)
            .json(
                new ApiResponse(
                    200 , newSubscription , "Subscribed to the channel successfully"
                )
            )
    }
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}