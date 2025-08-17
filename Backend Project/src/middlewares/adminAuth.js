import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyAdmin=(asyncHandler(async(req,resizeBy,next)=>{
    if(!req.user){
         throw new ApiError(401, "Unauthorized");
    }
    if (req.user.role !== "admin") {
    throw new ApiError(403, "Access denied: Admins only");
  }
  next();
}));