import { v2 as cloudinary } from "cloudinary";
import fs from "fs"

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
	try {
		if (!localFilePath) {
			return null; 
		}
		// upload the file on cloudinary
		const response = await cloudinary.uploader.upload(localFilePath, {
			resource_type: "auto",
		});
		// Safely delete the local file
		if (fs.existsSync(localFilePath)) {
			fs.unlinkSync(localFilePath);
		}
		console.log("CLOUDINARY UPLOAD RESPONSE: ", response);
		return response;
	} catch (error) {
		console.error("CLOUDINARY UPLOAD ERROR: ", error);
		// Safely delete the local file if it exists
		if (fs.existsSync(localFilePath)) {
			fs.unlinkSync(localFilePath);
		}
		return null;
	}
};

export const DeleteFile = async (publicId) => {
	try {
		if (!publicId) {
			console.log("No public ID provided for deletion");
			return { result: "not_found" };
		}

		const result = await cloudinary.uploader.destroy(publicId);
		console.log("Cloudinary deletion result:", result);
		return result;
	} catch (error) {
		console.error("src :: utils :: Cloudinary :: DeleteFile", error);
		throw error;
	}
};
export { uploadOnCloudinary };
