 
import mongoose,{Schema} from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2"


const evenetAttendSchema=new Schema(
    {
        event:{
            type:Schema.Types.ObjectId,
            ref:"Events",
            required:true
        },
        user:{
            type:Schema.Types.ObjectId,
            ref:"User",
            required:true
        }

    },
    {timestamps:true}
);
evenetAttendSchema.index({ event: 1, user: 1 }, { unique: true });

evenetAttendSchema.plugin(aggregatePaginate);

export const EventAttend=mongoose.model("EventAttend",evenetAttendSchema);