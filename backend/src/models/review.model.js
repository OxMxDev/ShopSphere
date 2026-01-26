import mongoose,{Schema} from "mongoose";

const reviewSchema = new Schema({
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    name:String,
    rating:{type:Number,required:true,min:1,max:5},
    comment:String,
},{timestamps:true})

export const Review = mongoose.model("Review",reviewSchema)