import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";

// For __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sendEmail = async ({ to, subject, text, html, attachments }) => {
	try {
		// 1️⃣ Create transporter
		const transporter = nodemailer.createTransport({
			service: "gmail",
			host: "smtp.gmail.com", // ✅ fixed typo (.com not .email)
			port: 587,
			secure: false,
			auth: {
				user: process.env.AUTH_USER,
				pass: process.env.AUTH_PASS, // store in .env (never hardcode)
			},
		});

		// 2️⃣ Define mail options
		const mailOptions = {
			from: {
				name: "Ecommerce App",
				address: process.env.AUTH_USER,
			},
			to, // e.g. "user@gmail.com"
			subject,
			text,
			html,
			attachments, // optional
		};

		// 3️⃣ Send mail
		const info = await transporter.sendMail(mailOptions);
		console.log("✅ Email sent:", info.response);
		return info;
	} catch (error) {
		console.error("❌ Error sending email:", error);
		throw error;
	}
};

export default sendEmail;
