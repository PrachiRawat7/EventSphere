import jwt from "jsonwebtoken";
import {User} from "../models/users.models.js";
import{ApiError} from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js";



export const verifyJWT=asyncHandler(async(req,res,next)=>{
    const token=req.cookies?.accessToken||req.body?.accessToken || 
    req.header("Authorization")?.replace("Bearer ","");
    if(!token)
    {
        throw new ApiError(401,"Unauthorized");

    }
    try{
       const decoded= jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
       const user= await User.findById(decoded?._id).select("-password -refreshToken")
       if(!user)
       {
            throw new ApiError(400,"Invalid token");
       }
       //adding info extracted from data base to the request
       req.user=user

       next()

    }
    catch(err)
    {
        
        throw new ApiError(402,err.message || "Invalid token");
    }

})
