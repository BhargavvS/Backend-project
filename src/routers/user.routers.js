import {Router} from "express";
import { registerUser , loginUser , loggoutUser  , RefreshAccessToken} from '../controllers/user.controller.js';
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


export default router;