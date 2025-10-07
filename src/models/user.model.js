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
        unique:true,
        lowercase:true
    },
    password:{
        type:String,
        requried:true,
        minLength:6,
    },
    addresss:[
        {
            street:String,
            city:String,
            state:String,
            postalCode:String,
            country:String,
            isDefault:{type:Boolean,default:false}
        }
    ],
    phone:{
        type:String,
    },
    isVerified:{
        type:Boolean,
        default:false
    }

},{timestamps:true})

export const User = mongoose.model("User",userSchema)