//name
// description
// location
// time
// date
// eimage
// createdby

import {User} from "./users.models.js";
import mongoose,{Schema} from "mongoose";

 const eventSchema=new Schema(
    {
        name:{
            type:String,
            required:true
        },
        description:{
            type:String,
            required:true
        },
        location:{
            type:String,
            required:true
        },
        date:{
            type:Date,
            required:true,
        },
        
        eimage:{
            type:String,
             default: "https://cdn-cjhkj.nitrocdn.com/krXSsXVqwzhduXLVuGLToUwHLNnSxUxO/assets/images/optimized/rev-ff94111/spotme.com/wp-content/uploads/2020/07/Hero-1.jpg"

        },
        createdBy:{
            type: Schema.Types.ObjectId,
            ref:"User",
            required:true,
        }
    },
    {timestamps:true}
 )
 export const Events=mongoose.model("Events",eventSchema);

