import mongoose,{Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
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

userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next()
    this.password = await bcrypt.hash(this.password,10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password)
}

export const User = mongoose.model("User",userSchema)