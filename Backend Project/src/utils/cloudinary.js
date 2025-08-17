import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";
import dotenv from "dotenv"

dotenv.config()


//configuration
cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
    });

    const uploadONCloudinary=async (localfilePath)=>{
        try{
            if(!localfilePath) return null;
            const response=await cloudinary.uploader.upload(
                localfilePath,{
                    resource_type:"auto"
                }
            )
            console.log("File uploaded on cloudinary. File src "+response.url)
            //now that is is uploaded on cludinary we will delete from server
            fs.unlink(localfilePath);
            return response;
        }
        catch{
            fs.unlink(localfilePath)
            return null;
        }
    }
   
    export {uploadONCloudinary};