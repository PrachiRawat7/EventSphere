import mongoose, {Schema} from "mongoose";


const ticketSchema=new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    event:{
        type:Schema.Types.ObjectId,
        ref:"Events",
        required:true
    },
    qrCode:{
        type:String,
        required:true
    }

},
{timeStamps:true}
)
export const Ticket=mongoose.model("Ticket",ticketSchema)