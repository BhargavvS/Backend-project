import express from "express"
const app = express()
import cors from "cors" // cross origin resource sharing
import cookieParser from "cookie-parser"
// router import
import userRouter from "./routers/user.routers.js"
app.use(cors({
    origin : process.env.CORS_ORIGIN,
    Credential : true
}))

app.use(express.json({limit : "16kb"}))
app.use(express.urlencoded({extended : true , limit : "16kb"}))
app.use(express.static("public"))
app.use(cookieParser()) // to manage and access the cookies 

// import healthcheckRouter from "../routes/healthcheck.router.js"
import healthcheckRouter from "./routers/healthcheck.router.js"
import tweetRouter from "./routers/tweet.router.js"
import subscriptionRouter from "./routers/subscription.router.js"
import videoRouter from "./routers/video.router.js"
import commentRouter from "./routers/comment.router.js"
import likeRouter from "./routers/like.router.js"
import playlistRouter from "./routers/playlist.router.js"
import dashboardRouter from "./routers/dashboard.router.js"

//routes declaration
// app.use("api/v1/user" , userRouter) example
app.use("/api/v1/healthcheck", healthcheckRouter)
app.use("/api/v1/users", userRouter)
app.use("/api/v1/tweets", tweetRouter)
app.use("/api/v1/subscriptions", subscriptionRouter)
app.use("/api/v1/videos", videoRouter)
app.use("/api/v1/comments", commentRouter)
app.use("/api/v1/likes", likeRouter)
app.use("/api/v1/playlist", playlistRouter)
app.use("/api/v1/dashboard", dashboardRouter)



export { app }