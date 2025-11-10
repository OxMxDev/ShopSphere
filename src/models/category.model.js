import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema(
	{
		name: {
			type: String,
			required: true,
			unique: true,
			trim: true,
		},
		description: {
			type: String,
			trim: true,
		},
		image: {
			type: String,
		},
	},
	{ timestamps: true }
);

export const Category = mongoose.model("Category", categorySchema);
