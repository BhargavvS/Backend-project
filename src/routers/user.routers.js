import {Router} from "express";
import { registerUser , 
    loginUser , 
    loggoutUser  , 
    RefreshAccessToken , 
    updatePassword , 
    getCurrentUser ,
    updateUserAccountDetails, 
    upadeUserAvatar,
    updateUserCoverImage ,
     getUserChannelDetails , 
     getWatchHistory
    } from '../controllers/user.controller.js';
import { upload } from '../middlewares/multer.middleware.js';   
import {validateJWT} from '../middlewares/auth.middleware.js';


const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }, 
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
    )

router.route("/login").post(loginUser)

router.route("/logout").post(validateJWT , loggoutUser)

router.route("/refresh-token").post(RefreshAccessToken)
router.route("/change-password").post(validateJWT , updatePassword)
router.route("/current-user").get(validateJWT , getCurrentUser)
router.route("/update-user").post(validateJWT , updateUserAccountDetails)
router.route("/avatar").post(validateJWT , upload.single("avatar") , upadeUserAvatar)
router.route("/cover-image").post(validateJWT , upload.single("coverImage") , updateUserCoverImage)
router.route("/c/:username").get(validateJWT , getUserChannelDetails)
router.route("/channel-details").get(validateJWT , getUserChannelDetails)
router.route("/history").get(validateJWT , getWatchHistory)

export default router;