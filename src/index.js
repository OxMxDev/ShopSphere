import dotenv from 'dotenv';
dotenv.config();
import connectDB from './db/index.js';
import app from './app.js';
connectDB()
.then(()=>{
    app.on('error',(err)=>{
        console.log("ERROR: ",err);
    })
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`Server is running on port ${process.env.PORT || 8000}`);
    })
})
.catch((err)=>{
    console.error("Database connection failed",err);
})