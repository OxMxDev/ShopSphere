import mongoose,{Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const userSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
        avatar:{
            type:String,
            required:true,
        },
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
		},
		password: {
			type: String,
			requried: true,
			minLength: 3,
		},
		address: {
			type: String, 
			required: true,
			trim: true,
		},
		phone: {
			type: String,
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next()
    this.password = await bcrypt.hash(this.password,10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
			{
				_id: this._id,
				email: this.email,
				username: this.username,
				fullName: this.fullName,
			},
			process.env.ACCESS_TOKEN_SECRET,
			{
				expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
			}
		);
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
			{
				_id: this._id,
				email: this.email,
				username: this.username,
				fullName: this.fullName,
			},
			process.env.REFRESH_TOKEN_SECRET,
			{
				expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
			}
		);
}

export const User = mongoose.model("User",userSchema)