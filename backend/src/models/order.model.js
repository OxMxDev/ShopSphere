import mongoose,{Schema} from "mongoose";

const orderSchema = new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    orderItems:[
        {
            product:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Product",
                required:true
            },
            name:String,
            qty:Number,
            price:Number,
            image:String
        },
    ],
    shippingAddress:{
        street:String,
        city:String,
        state:String,
        postalCode:String,
        country:String
    },
    paymentMethod:{
        type:String,
        required:true
    },
    paymentResult:{
        id:String,
        status:String,
        update_time:String,
        email_address:String
    },
    taxPrice:{type:Number,default:0.0},
    shippingPrice:{type:Number,default:0.0},
    totalPrice:{type:Number,required:true},
    isPaid:{type:Boolean,default:false},
    paidAt:Date,
    isDelievered:{type:Boolean,default:false},
    delieveredAt:Date,
},{timestamps:true})

export const Order = mongoose.model("Order",orderSchema)