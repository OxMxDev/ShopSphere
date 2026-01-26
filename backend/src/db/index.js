import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

async function connectDB(){
    try{
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
        console.log('MONGODB CONNECTED !! DB HOST', connectionInstance.connection.host)
    }catch(err){
        console.error("MONGODB CONNECTION ERROR: ",err)
    } 
}

export default connectDB;