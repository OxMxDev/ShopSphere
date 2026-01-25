import React, { useState} from "react";
import { loginUser, getCurrentUser } from "../api/auth.api";
import {useNavigate} from "react-router-dom"
import PageContainer from "../components/layout/PageContainer";
import "./Login.css";
const Login = ({onLoginSuccess}) => {
	const [password, setPassword] = useState("");
	const [email, setEmail] = useState("");
	const [error, setError] = useState("");
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
				<div className="w-[500px] h-[600px] bg-white rounded-2xl shadow-xl p-8 flex flex-col gap-4 justify-center  items-center">
					<p>E-commerce store</p>
					<p>Login</p>
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
						<input
							className="border rounded-lg p-2"
							type="password"
							id="password"
							value={password}
							onChange={(e) => {
								setPassword(e.target.value);
								setError(""); 
							}}
						/>

						<button
							className="cursor-pointer bg-blue-500 w-[350px] rounded-lg text-white p-2"
							onClick={handleSubmit}
						>
							Login
						</button>
						<p>Don't have an account? <a href="/register" className="text-blue-600 font-bold">Sign Up</a></p>
					</form>
				</div>
			</PageContainer>
		</div>
	);
};

export default Login;
