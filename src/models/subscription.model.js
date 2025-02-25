import mongoose ,{Schema} from "mongoose"

const subsscriptionSchema = new Schema({
    subscriber : {
        typeof : Schema.Types.ObjectId,
        ref : "User"
    },
    channel : {
        typeof : Schema.Types.ObjectId,
        ref : "User"
    }
},{
    timestamps:true
})

export const Subscription = mongoose.model("Subscription", subsscriptionSchema)