import dotenv from "dotenv";
import {app} from "./app.js";
import connectDB from "./db/index.js";



//tell where my environment variables are
dotenv.config({
    path:"./.env"
})
const PORT=process.env.PORT||3001;

connectDB()
.then(()=>{
    
        console.log(`Listening on PORT ${PORT}`);
    
})
.catch((err)=>{
    console.log("MonogoDB Connection Errorsss",err);
})