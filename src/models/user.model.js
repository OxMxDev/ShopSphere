import mongoose,{Schema} from "mongoose";

const userSchema = new Schema({
    name:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        trim:true
    }
})

export const User = mongoose.model("User",userSchema)