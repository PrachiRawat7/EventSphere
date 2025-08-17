// we use this file to make a connection
import mongoose from "mongoose";
import {DBName} from "../constants.js";

const connectDB=async()=>{
    try{
        const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URL}/${DBName}`)
        console.log(`MongoDB Cnnonected!! DB Host:${connectionInstance.connection.host}`);

    }
    catch(err)
    {
        console.log("MongoBD Connection Error",err);
        process.exit(1);
    }
    
}
export default connectDB;
