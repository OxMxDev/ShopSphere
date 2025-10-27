import nodemailer from "nodemailer";

const sendEmail = async (options) => {
	// Create a transporter using your email service
	const transporter = nodemailer.createTransport({
		service: "gmail", // or use 'smtp.ethereal.email' for testing
		auth: {
			user: process.env.SMTP_USER, // your email address
			pass: process.env.SMTP_PASS, // your app password (not your real password!)
		},
	});

	// Email details
	const mailOptions = {
		from: `"Ecommerce App" <${process.env.SMTP_USER}>`, 
		to: options.email, // recipient
		subject: options.subject,
		text: options.message, // plain text message
	};

	// Actually send the email
	await transporter.sendMail(mailOptions);
};

export default sendEmail;
