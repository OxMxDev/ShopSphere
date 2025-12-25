import React, { useState } from "react";
import { registerUser, getCurrentUser } from "../api/auth.api";
import { useNavigate } from "react-router-dom";
import PageContainer from "../components/layout/PageContainer";
import { toast } from "react-hot-toast";
const SignUp = ({ onLoginSuccess }) => {
    const [name, setName] = useState("");
	const [password, setPassword] = useState("");
	const [email, setEmail] = useState("");
	const [address, setAddress] = useState("");
    const [number, setNumber] = useState("");
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
		formData.append("phone", number); // 🔴 backend expects "phone"
		formData.append("avatar", avatar); // 🔴 EXACT MATCH

		try {
			await registerUser(formData);
			toast.success("User registered successfully");;
			navigate("/login");
		} catch (err) {
			toast.error(err.response?.data?.message || "Signup failed");
		}
	};

	return (
		<div className="flex">
			<PageContainer>
				<div className="w-[500px] h-[600px] bg-white rounded-2xl shadow-xl p-4 flex flex-col gap-2 justify-center  items-center">
					<p>E-commerce store</p>
					<p>Sign Up</p>
					<form
						action=""
						autoComplete="on"
						className="flex flex-col gap-4 w-[80%]"
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
						<input
							className="border rounded-lg p-2"
							type="password"
							id="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
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
							type="number"
							id="phnumber"
							value={number}
							max={10}
							min={10}
							onChange={(e) => setNumber(e.target.value)}
						/>
						<input
							type="file"
							accept="image/*"
							onChange={handleImageChange}
							className="border p-2 rounded"
							required
						/>
						<button
							className="cursor-pointer bg-blue-500 w-[350px] rounded-lg text-white p-2"
							onClick={handleSubmit}
						>
							Sign Up
						</button>
						<p>
							Already have an account?{" "}
							<a href="/login" className="text-blue-600 font-bold">
								Login
							</a>
						</p>
					</form>
				</div>
			</PageContainer>
		</div>
	);
};

export default SignUp;
