import nodemailer from "nodemailer";

// Create transporter - using Gmail as example
// For production, use a dedicated email service like SendGrid, Mailgun, etc.
const createTransporter = () => {
    return nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD, // Use App Password for Gmail
        },
    });
};

export const sendPasswordResetEmail = async (email, resetToken, frontendUrl) => {
    try {
        const transporter = createTransporter();
        
        const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;
        
        const mailOptions = {
            from: `"ShopSphere" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Password Reset Request - ShopSphere",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #3B82F6;">ShopSphere</h1>
                    </div>
                    
                    <h2 style="color: #333;">Password Reset Request</h2>
                    
                    <p style="color: #666; line-height: 1.6;">
                        You have requested to reset your password. Click the button below to set a new password:
                    </p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetUrl}" 
                           style="background-color: #3B82F6; color: white; padding: 12px 30px; 
                                  text-decoration: none; border-radius: 5px; display: inline-block;
                                  font-weight: bold;">
                            Reset Password
                        </a>
                    </div>
                    
                    <p style="color: #666; line-height: 1.6;">
                        If the button doesn't work, copy and paste this link into your browser:
                    </p>
                    <p style="color: #3B82F6; word-break: break-all;">
                        ${resetUrl}
                    </p>
                    
                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                        <p style="color: #999; font-size: 12px;">
                            ⚠️ This link will expire in 15 minutes.
                        </p>
                        <p style="color: #999; font-size: 12px;">
                            If you didn't request this password reset, please ignore this email or contact support if you have concerns.
                        </p>
                    </div>
                </div>
            `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Password reset email sent:", info.messageId);
        return true;
    } catch (error) {
        console.error("Error sending password reset email:", error);
        throw error;
    }
};
