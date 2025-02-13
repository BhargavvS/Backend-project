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


// app.use("api/v1/user" , userRouter)
app.use("/api/v1/users", userRouter)

export { app }