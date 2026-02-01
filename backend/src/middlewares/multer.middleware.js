import multer from "multer";
import path from "path";
import os from "os";

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		// Use /tmp for Vercel serverless compatibility
		cb(null, os.tmpdir());
	},
	filename: function (req, file, cb) {
		// Use unique filename to prevent conflicts
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
		cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
	},
});

export const upload = multer({
	storage,
});
