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
		fs.unlinkSync(localFilePath);
		console.log("CLOUDINARY UPLOAD RESPONSE: ", response);
		return response;
	} catch (error) {
		fs.unlinkSync(localFilePath); // remove the file from localally saved file as the operation got failed
		return null;
	}
};

export const DeleteFile = async (publicId) => {
	try {
		const result = await cloudinary.uploader.destroy(publicId);
		return result;
	} catch (error) {
		console.error("src :: utils :: Cloudinary :: DeleteFile", error);
		throw error;
	}
};
export { uploadOnCloudinary };
