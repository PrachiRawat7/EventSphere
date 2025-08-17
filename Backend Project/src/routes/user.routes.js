import {Router} from "express";
import {registerUser,logoutUser,loginUser,getCurrentUser} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
// import {upload} from "../middlewares/multer.middleware.js"

const router=Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser); 

//secure routes
router.route("/me").get(verifyJWT,getCurrentUser)
router.route("/logout").post(verifyJWT,logoutUser)


export default router;
