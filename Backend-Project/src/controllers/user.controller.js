import { ApiResponse } from "../utils/ApiResponse.js";
import{ApiError} from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/users.models.js";
import jwt from "jsonwebtoken";
import { uploadONCloudinary } from "../utils/cloudinary.js";

const generateAccessAnsRefreshToken=async(userId)=>{
   try {
    const user= await User.findById(userId);
 
    if(!user)
    {
         throw new ApiError(400,"No user found");
    }
 
   const accessToken= user.generateAccessToken()
     const refreshToken=user.generateRefreshToken()
     user.refreshToken=refreshToken;
     await user.save({validateBeforeSave:false});
     return {accessToken,refreshToken}
   } catch (error) {
        throw new ApiError(500,"Something went wrong wile generating access and refresh token")
    
   }
}




const registerUser=asyncHandler(async(req,res)=>{

    console.log("Inside register controller");
    const{username,fullname,email,password}=req.body;
    //checking if all fields are filled
    if(!username ||!fullname||!email||!password){
        throw new ApiError(400,"All fields are reuired")
    }
    
    //validate mail

     const isSimpleComEmail = (e) =>
    /^[^@\s]+@[^@\s]+\.com$/i.test((e || "").trim());

  if (!isSimpleComEmail(email)) {
    throw new ApiError(400, "Email must contain @ and end with .com");
  }
  

  const isValidPassword = (pwd) =>
  /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{5,}$/.test((pwd || "").trim());

if (!isValidPassword(req.body.password)) {
  throw new ApiError(
    400,
    "Password must be at least 5 characters long, include 1 uppercase letter and 1 special character"
  );
}



    //user already exists
    const existingUser=await User.findOne({
        $or:[{email},{username}]
    });
    if(existingUser)
    {
        throw new ApiError(409,"User with this email or username already exists")
    }

    //Creaet User

    const newUser=await User.create({
        username,
        fullname,
        email,
        password,
        role:"user"
    })


    const createdUser=await User.findById(newUser._id).select(
        "-password -refreshToken"
    )
    return res
    .status(201)
    .json(new ApiResponse(200,createdUser,"Registered Successfully"));



     




})


const loginUser=asyncHandler(async(req,res)=>{
    const {username,password}=req.body;
    

    //check if all are filled
    if(!username ||!password)
    {
        throw new ApiError(400,"All fields required");
    }


    //check user

    const user=await User.findOne({
        $and:[{username}]
    })

    if(!user)
    {
        throw new ApiError(404,"User Not Found");
    }

    const isPasswordValid=await user.isPasswordCorrect(password);

    if(!isPasswordValid)
    {
        throw new ApiError(401,"Passowrd Not correct");
    }

    const {accessToken,refreshToken}=await generateAccessAnsRefreshToken(user._id);

    const loggedInUser=await User.findById(user._id).select("-password -refreshToken");

    if(!loggedInUser)
    {
        throw new ApiError(401,"User not Found");
    }
    const options={
        httpOnly:true,//cookie not modifileble from client side
        secure:process.env.NODE_ENV==="production",


    }
    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)//name,value,options
    .json(new ApiResponse(200,
        {user:loggedInUser,accessToken,refreshToken},
        "User loggedIn Suggesfully"))



})



const logoutUser=asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken:undefined
            }
        },
        {
            new:true //return prev record which is not updated or new record
        }     
    )

    const options={
            httpOnly:true,
            secure:process.env.NODE_ENV==="production"
        }
    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"Iser logged out succesfully"))
})

const refreshAcessToken=asyncHandler(async(req,res)=>{
   const incomingRefreshToken= req.cookies?.refreshToken||req.body.refreshToken;
   if(!incomingRefreshToken)
   {
    throw new ApiError(400,"Refresh token Not Found");
   }
   try {
    //validation
    const decodedToken=jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET);
    const user=await User?.findById(decodedToken._id);
    if(!user)
    {
        throw new ApiError(405,"Invalid Refresh token");
    }

    if(incomingRefreshToken!==user?.refreshToken)
    {
        throw new ApiError(401,"Invalid Refresh token");

    }
    const options={
        httpOnly:true,
        secure:process.env.NODE_ENV==="production",
    }
    const{accessToken,refreshToken:newRefreshToken}=await generateAccessAnsRefreshToken(user._id);

    res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",newRefreshToken,options)
    .json(new ApiResponse(200,{accessToken,refreshAcessToken:newRefreshToken},"Access Token Created Succesfully"));



   } catch (error) {
    throw new ApiError(405,"Error");
    
   }
   
})


const updatePassword=asyncHandler(async(req,res)=>{
    const {oldpassword,newPassword}=req.body;
    const user=await User.findById(req.user?._id)

    const isPasswordValid=await isPasswordCorrect(oldpassword);
    if(!isPasswordValid)
    {
        throw new ApiError(400,"Password does not match");
    }
    user.password=newPassword;

    user.save({validateBeforeSave:false});

    res
    .status(200)
    .json(new ApiResponse(200,{},"Password Changes Succesfully"))

})

const getCurrentUser=asyncHandler(async(req,res)=>{
    return res.status(200).json(new ApiResponse(200,req.user,"Cuurent user details"))
})

const updateAccountDetails=asyncHandler(async(req,res)=>{
    const{fullname,email}=req.body;
    if(!fullname || !email)
    {
        throw new ApiError(400,"Fullname and email are needed");
    }
    const user=await User.findByIdAndUpdate(req.user._id,
        {
            $set:{
                fullname,
                email:email
            }
  
        },
        {new:true}
    ).select("password refreshToken");

    res
    .stauts(200)
    .json(new ApiResponse(200,user,"Updated successfully"));

})

// const updateProfile=asyncHandler(async(req,res=>{
//     const piclocalPath=req.files?.path;

//     const profile=await uploadONCloudinary(piclocalPath);
//     if(!profile.url)
//     {
//         throw new ApiError(400,"Need profile picture");
//     }
//     User.findByIdAndUpdate(
//         req.user?._id,
//         {
//             $set:{
//                profileimage:profile.url 
//             }
//         },
//         {new:true}

//     ).select("password refreshToken")


// }))




export {registerUser,loginUser,refreshAcessToken,logoutUser,
    updatePassword,getCurrentUser,updateAccountDetails
};