import mongoose , {Schema} from "mongoose";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import CryptoJS from "crypto-js"

const userSchema = new Schema({
    username:{
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        index: true,
        unique:true
    },
    email:{
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique:true
    },
    fullname:{
        type: String,
        required: true,
        trim: true,
    },
    avatar:{
        type: String, // cloudnary url
        required: true,
        
    },
    coverImage:{
        type: String, // cloudnary url
    },
    password: {
        type:String,
        required: [true, "Password is required"],
    },
    refreshToken:{
        type:String,
    },
    watchHistory:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Video"
    }
}, 
{
    timestamps: true
})

// there we are using normal function instead of arrow function because we need to use this keyword
userSchema.pre("save" , async function(next) {
   if(!this.isModified("password")) return next()
    
    this.password = await bcrypt.hash(this.password , 10)
    next()
})

userSchema.methods.matchpassword = async function(password){
    return await bcrypt.compare(password , this.password)
}

userSchema.methods.generateAccesstToken = function(){
   return jwt.sign( {
        _id : this._id,
        email : this.email,
        username : this.username,
        fullname : this.fullname
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES
    }
)
}

userSchema.methods.generateRefreshToken = function() {
    return jwt.sign( {
        _id : this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES
    }
)
}

userSchema.methods.getPublicId = function(url) {
    const bytes = CryptoJS.AES.decrypt(url , process.env.CLOUDINARY_API_SECRET);
    const decryptedUrl = bytes.toString(CryptoJS.enc.Utf8);

    return decryptedUrl
}

export const User = mongoose.model("User",userSchema)