import mongoose,{Schema} from "mongoose";

const cartSchema = new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    items:[
        {
            product:{type:mongoose.Schema.Types.ObjectId,ref:"Product",required:true},
            qty:{type:Number,required:true,min:1},
        },
    ],
},{timestamps:true})

export const Cart = mongoose.model('Cart',cartSchema)