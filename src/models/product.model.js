import mongoose,{Schema} from "mongoose";

const productSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		description: {
			type: String,
		},
		price: {
			type: Number,
			required: true,
		},
		brand: {
			type: String,
		},
		category: {
			type: String,
			required: true,
		},
		stock: {
			type: Number,
			required: true,
			default: 0,
		},
		images: {
			type: String,
			required: true,
		},
		ratings: {
			type: Number,
			default: 0,
		},
		numReviews: {
			type: Number,
			default: 0,
		},
	},
	{ timestamps: true }
);

export const Product = mongoose.model("Product",productSchema)