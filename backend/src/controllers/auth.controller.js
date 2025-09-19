const userModel = require('../models/user.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

async function userRegister(req,res){
    const {name,email,password} = req.body
    const isUserAlreadyExists = await userModel.findOne({
        email
    })
    if(isUserAlreadyExists){
        return res.status(400).json({
            success:false,
            message:"User with this email already exists"
        })
    }
    const hashPassword = await bcrypt.hash(password,12)
    const user = await userModel.create({
        name,
        email,
        password:hashPassword
    })

    const token = jwt.sign({
        id:user._id
    },process.env.JWT_SECRET)

    res.cookie('token',token)
    res.status(201).json({
			message: "User registered successfully",
			user: {
				_id: user._id,
				name: user.name,
				email: user.email,
			},
		});

}
async function userLogin(req,res){
    const {email,password} = req.body
    const user = await userModel.findOne({
        email
    })
    if(!user){
        return res.status(400).json({
            message:"Invalid email or password"
        })
    }
    const isPasswordValid = await bcrypt.compare(password,user.password)
    if(!isPasswordValid){
        return res.status(400).json({
            message:"Invalid email or password"
        })
    } 
    const token = jwt.sign({
        id: user._id
    },process.env.JWT_SECRET)

    res.cookie("token",token)
    res.status(200).json({
        message: "User logged in successfully",
        user:{
            _id: user._id,
            name: user.name,
            email: user.email
        }
    })
}
async function userLogout(req,res){
    res.clearCookie("token")
    res.status(200).json({
        message: "User logged out successfully"
    })
}
module.exports = {
    userRegister,
    userLogin,
    userLogout
}