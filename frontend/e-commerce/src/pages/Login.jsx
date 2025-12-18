import React, { useState} from "react";
import { loginUser, getCurrentUser } from "../api/auth.api";
import {useNavigate} from "react-router-dom"
const Login = () => {
	const [password, setPassword] = useState("");
	const [email, setEmail] = useState("");
    let navigate = useNavigate()

	const handleSubmit = async (e) => {
		e.preventDefault();

		console.log({ email, password });
        loginUser({email,password}).then((res)=>{
            console.log(res.data);
            navigate("/")
        }).catch((err)=>{
            console.log(err);
        })
	};

	return (
		<>
			<div className="w-[300px] h-[600px] flex flex-col gap-4 justify-center ">
				<p>E-commerce store</p>
				<p>Login</p>
				<form action="" autoComplete="on">
					<label htmlFor="email">Email</label>
					<input
						className="border rounded-lg"
						type="text"
						id="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
					<label htmlFor="password">Password</label>
					<input
						className="border rounded-lg"
						type="password"
						id="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>

					<button
						className="cursor-pointer bg-blue-500 w-[200px] rounded-lg text-white p-2"
						onClick={handleSubmit}
					>
						Login
					</button>
				</form>
			</div>
		</>
	);
};

export default Login;
