import React, { useState } from "react";
import { Link } from "react-router-dom";
import PageContainer from "../components/layout/PageContainer";
import { toast } from "react-hot-toast";

const ForgotPassword = () => {
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);
	const [submitted, setSubmitted] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!email) {
			toast.error("Please enter your email address");
			return;
		}

		try {
			setLoading(true);
			// TODO: Implement backend forgot password endpoint
			// await forgotPassword(email);
			
			// For now, show a success message
			setSubmitted(true);
			toast.success("If an account exists with this email, you will receive a password reset link.");
		} catch (err) {
			toast.error(err.response?.data?.message || "Something went wrong");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex">
			<PageContainer>
				<div className="w-[500px] min-h-[400px] bg-white rounded-2xl shadow-xl p-8 flex flex-col gap-4 justify-center items-center">
					<p className="text-xl font-semibold text-gray-700">E-commerce store</p>
					<p className="text-2xl font-bold">Forgot Password</p>

					{submitted ? (
						<div className="flex flex-col items-center gap-4 py-8">
							{/* Email sent icon */}
							<svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
							</svg>
							<h3 className="text-lg font-semibold text-gray-700">Check your email</h3>
							<p className="text-gray-500 text-center max-w-sm">
								If an account exists with <strong>{email}</strong>, you will receive a password reset link shortly.
							</p>
							<Link 
								to="/login" 
								className="mt-4 text-blue-600 hover:underline font-medium"
							>
								← Back to Login
							</Link>
						</div>
					) : (
						<form
							onSubmit={handleSubmit}
							className="flex flex-col gap-4 w-[80%]"
						>
							<p className="text-gray-500 text-sm text-center">
								Enter your email address and we'll send you a link to reset your password.
							</p>

							<label htmlFor="email">Email Address</label>
							<input
								className="border rounded-lg p-2"
								type="email"
								id="email"
								placeholder="Enter your email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>

							<button
								type="submit"
								disabled={loading}
								className={`cursor-pointer bg-blue-500 w-full rounded-lg text-white p-2 hover:bg-blue-600 transition-colors ${
									loading ? "opacity-50 cursor-not-allowed" : ""
								}`}
							>
								{loading ? "Sending..." : "Send Reset Link"}
							</button>

							<div className="text-center">
								<Link to="/login" className="text-sm text-blue-600 hover:underline">
									← Back to Login
								</Link>
							</div>
						</form>
					)}
				</div>
			</PageContainer>
		</div>
	);
};

export default ForgotPassword;
