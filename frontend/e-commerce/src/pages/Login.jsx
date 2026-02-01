import React, { useState} from "react";
import { loginUser, getCurrentUser } from "../api/auth.api";
import {useNavigate, Link} from "react-router-dom"
import PageContainer from "../components/layout/PageContainer";
import "./Login.css";

const Login = ({onLoginSuccess}) => {
	const [password, setPassword] = useState("");
	const [email, setEmail] = useState("");
	const [error, setError] = useState("");
	const [showPassword, setShowPassword] = useState(false);
    let navigate = useNavigate()

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(""); 

        loginUser({email,password}).then((res)=>{
            onLoginSuccess();
        }).catch((err)=>{
            console.log(err);
            setError("Email or password is incorrect");
        })
	};

	return (
		<div className="flex">
			<PageContainer>
				<div className="w-full max-w-[500px] h-auto min-h-[600px] bg-white rounded-2xl shadow-xl p-8 flex flex-col gap-4 justify-center items-center mx-4">
					<p className="text-xl font-semibold text-gray-700">E-commerce store</p>
					<p className="text-2xl font-bold">Login</p>
					<form
						action=""
						autoComplete="on"
						className="flex flex-col gap-4 w-[80%]"
					>
						{error && (
							<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative error-popup" role="alert">
								<strong className="font-bold">Error! </strong>
								<span className="block sm:inline">{error}</span>
							</div>
						)}
						<label htmlFor="email">Email</label>
						<input
							className="border rounded-lg p-2"
							type="text"
							id="email"
							value={email}
							onChange={(e) => {
								setEmail(e.target.value);
								setError(""); 
							}}
						/>
						<label htmlFor="password">Password</label>
						<div className="relative">
							<input
								className="border rounded-lg p-2 w-full pr-10"
								type={showPassword ? "text" : "password"}
								id="password"
								value={password}
								onChange={(e) => {
									setPassword(e.target.value);
									setError(""); 
								}}
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
							>
								{showPassword ? (
									// Eye-off icon (hide password)
									<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
									</svg>
								) : (
									// Eye icon (show password)
									<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
									</svg>
								)}
							</button>
						</div>

						<div className="text-right">
							<Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
								Forgot Password?
							</Link>
						</div>

						<button
							className="cursor-pointer bg-blue-500 w-full rounded-lg text-white p-2 hover:bg-blue-600 transition-colors"
							onClick={handleSubmit}
						>
							Login
						</button>
						<p className="text-center">Don't have an account? <Link to="/register" className="text-blue-600 font-bold hover:underline">Sign Up</Link></p>
					</form>
				</div>
			</PageContainer>
		</div>
	);
};

export default Login;
