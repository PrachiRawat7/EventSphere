//  id string pk
//   fullname string
//   username string
//   email string
// role enum("user", "admin")
//password
//refresh toke

import mongoose,{Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema =new Schema(
    {
        username:{
            type:String,
            required:true,
            unique:true,
            trim:true,
            index:true
        },
        email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true
        },
        fullname:{
            type:String,
            required:true,
            trim:true,
            index:true
        },
        profileimage:{
            type:String,
            default: "https://i.pinimg.com/280x280_RS/26/ac/72/26ac7202782f42973ab2a64caf003f95.jpg"
        },
        role :{
            type:String,
            enum:["user","admin"],
            default:"user"
        },
        password:{
            type:String,
            required:[true,"Password is required"]
        },
        refreshToken:{
            type:String

        }


        
    },
    {timestamps:true}

)
userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();

    this.password=await bcrypt.hash(this.password,10);
    next();
})
userSchema.methods.isPasswordCorrect=async function(password){
  const result = await bcrypt.compare(password, this.password);
  return result;
   return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken=function (){
    return jwt.sign({
        _id:this._id,
        email:this.email,
        username:this.username,
        fullname:this.fullname
    },process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    });
}

userSchema.methods.generateRefreshToken=function (){
    return jwt.sign({
        _id:this._id,
        
    },process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    });
}




export const User=mongoose.model("User",userSchema);