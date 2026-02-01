import React, { useState } from "react";
import { registerUser, registerAdmin } from "../api/auth.api";
import { useNavigate, Link } from "react-router-dom";
import PageContainer from "../components/layout/PageContainer";
import { toast } from "react-hot-toast";

const SignUp = ({ onLoginSuccess }) => {
    const [name, setName] = useState("");
	const [password, setPassword] = useState("");
	const [email, setEmail] = useState("");
	const [address, setAddress] = useState("");
    const [number, setNumber] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [isAdmin, setIsAdmin] = useState(false);
	const [adminKey, setAdminKey] = useState("");
	const [loading, setLoading] = useState(false);
	let navigate = useNavigate();
	const [avatar, setAvatar] = useState(null);

    const handleImageChange = (e) => {
		setAvatar(e.target.files[0]);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!avatar) {
			toast.error("Avatar file is required");
			return;
		}

		const formData = new FormData();
		formData.append("name", name);
		formData.append("email", email);
		formData.append("password", password);
		formData.append("address", address);
		formData.append("phone", number);
		formData.append("avatar", avatar);

		if (isAdmin) {
			formData.append("adminKey", adminKey);
		}

		try {
			setLoading(true);
			if (isAdmin) {
				await registerAdmin(formData);
				toast.success("Admin registered successfully");
			} else {
				await registerUser(formData);
				toast.success("User registered successfully");
			}
			navigate("/login");
		} catch (err) {
			toast.error(err.response?.data?.message || "Signup failed");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex">
			<PageContainer>
				<div className="w-full max-w-[500px] min-h-[650px] bg-white rounded-2xl shadow-xl p-6 flex flex-col gap-2 justify-center items-center my-4 mx-4">
					<p className="text-xl font-semibold text-gray-700">E-commerce store</p>
					<p className="text-2xl font-bold">Sign Up</p>
					
					{/* Admin Toggle */}
					<div className="flex items-center gap-2 mb-2">
						<label className="relative inline-flex items-center cursor-pointer">
							<input
								type="checkbox"
								className="sr-only peer"
								checked={isAdmin}
								onChange={(e) => setIsAdmin(e.target.checked)}
							/>
							<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
						</label>
						<span className="text-sm font-medium text-gray-700">
							Register as Admin
						</span>
					</div>

					<form
						action=""
						autoComplete="on"
						className="flex flex-col gap-3 w-[80%]"
					>
						<label htmlFor="name">Full Name</label>
						<input
							className="border rounded-lg p-2"
							type="text"
							id="name"
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
						<label htmlFor="email">Email</label>
						<input
							className="border rounded-lg p-2"
							type="text"
							id="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
						<label htmlFor="password">Password</label>
						<div className="relative">
							<input
								className="border rounded-lg p-2 w-full pr-10"
								type={showPassword ? "text" : "password"}
								id="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
							>
								{showPassword ? (
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
						</div>

						{/* Admin Key Field - only shown when admin toggle is on */}
						{isAdmin && (
							<>
								<label htmlFor="adminKey" className="flex items-center gap-2">
									Admin Key
									<span className="text-xs text-gray-500">(Required for admin registration)</span>
								</label>
								<input
									className="border rounded-lg p-2 border-orange-300 bg-orange-50"
									type="password"
									id="adminKey"
									placeholder="Enter admin registration key"
									value={adminKey}
									onChange={(e) => setAdminKey(e.target.value)}
								/>
							</>
						)}

						<label htmlFor="address">Address</label>
						<input
							className="border rounded-lg p-2"
							type="text"
							id="address"
							value={address}
							onChange={(e) => setAddress(e.target.value)}
						/>

						<label htmlFor="phnumber">Phone Number</label>
						<input
							className="border rounded-lg p-2"
							type="tel"
							id="phnumber"
							value={number}
							maxLength={10}
							placeholder="10 digit phone number"
							onChange={(e) => setNumber(e.target.value)}
						/>
						
						<label>Profile Picture</label>
						<input
							type="file"
							accept="image/*"
							onChange={handleImageChange}
							className="border p-2 rounded"
							required
						/>
						
						<button
							className={`cursor-pointer w-full rounded-lg text-white p-2 transition-colors ${
								isAdmin 
									? "bg-orange-500 hover:bg-orange-600" 
									: "bg-blue-500 hover:bg-blue-600"
							} ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
							onClick={handleSubmit}
							disabled={loading}
						>
							{loading ? "Registering..." : isAdmin ? "Register as Admin" : "Sign Up"}
						</button>
						<p className="text-center">
							Already have an account?{" "}
							<Link to="/login" className="text-blue-600 font-bold hover:underline">
								Login
							</Link>
						</p>
					</form>
				</div>
			</PageContainer>
		</div>
	);
};

export default SignUp;
