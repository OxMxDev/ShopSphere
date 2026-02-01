import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import PageContainer from "../components/layout/PageContainer";
import { toast } from "react-hot-toast";
import { resetPassword } from "../api/auth.api";

const ResetPassword = () => {
	const { token } = useParams();
	const navigate = useNavigate();
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!password || password.length < 3) {
			toast.error("Password must be at least 3 characters");
			return;
		}

		if (password !== confirmPassword) {
			toast.error("Passwords do not match");
			return;
		}

		try {
			setLoading(true);
			await resetPassword(token, password);
			setSuccess(true);
			toast.success("Password reset successful!");
			
			// Redirect to login after 3 seconds
			setTimeout(() => {
				navigate("/login");
			}, 3000);
		} catch (err) {
			toast.error(err.response?.data?.message || "Failed to reset password. The link may be invalid or expired.");
		} finally {
			setLoading(false);
		}
	};

	// Password visibility toggle button
	const EyeButton = ({ show, onClick }) => (
		<button
			type="button"
			onClick={onClick}
			className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
		>
			{show ? (
				<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
				</svg>
			) : (
				<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
				</svg>
			)}
		</button>
	);

	return (
		<div className="flex">
			<PageContainer>
				<div className="w-[500px] min-h-[450px] bg-white rounded-2xl shadow-xl p-8 flex flex-col gap-4 justify-center items-center">
					<p className="text-xl font-semibold text-gray-700">E-commerce store</p>
					<p className="text-2xl font-bold">Reset Password</p>

					{success ? (
						<div className="flex flex-col items-center gap-4 py-8">
							{/* Success icon */}
							<svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
							<h3 className="text-lg font-semibold text-gray-700">Password Reset Successful!</h3>
							<p className="text-gray-500 text-center max-w-sm">
								Your password has been reset. You will be redirected to login page shortly.
							</p>
							<Link 
								to="/login" 
								className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
							>
								Go to Login
							</Link>
						</div>
					) : (
						<form
							onSubmit={handleSubmit}
							className="flex flex-col gap-4 w-[80%]"
						>
							<p className="text-gray-500 text-sm text-center">
								Enter your new password below.
							</p>

							<label htmlFor="password">New Password</label>
							<div className="relative">
								<input
									className="border rounded-lg p-2 w-full pr-10"
									type={showPassword ? "text" : "password"}
									id="password"
									placeholder="Enter new password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
								/>
								<EyeButton show={showPassword} onClick={() => setShowPassword(!showPassword)} />
							</div>

							<label htmlFor="confirmPassword">Confirm Password</label>
							<div className="relative">
								<input
									className="border rounded-lg p-2 w-full pr-10"
									type={showConfirmPassword ? "text" : "password"}
									id="confirmPassword"
									placeholder="Confirm new password"
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
								/>
								<EyeButton show={showConfirmPassword} onClick={() => setShowConfirmPassword(!showConfirmPassword)} />
							</div>

							<button
								type="submit"
								disabled={loading}
								className={`cursor-pointer bg-blue-500 w-full rounded-lg text-white p-2 hover:bg-blue-600 transition-colors ${
									loading ? "opacity-50 cursor-not-allowed" : ""
								}`}
							>
								{loading ? "Resetting..." : "Reset Password"}
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

export default ResetPassword;
