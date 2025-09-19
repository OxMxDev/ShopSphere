import React, { useState } from "react";
import axios from "axios";

function App() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [message, setMessage] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setMessage("");

		try {
			// call your backend
			const res = await axios.post(
				"http://localhost:3000/api/auth/user/register", // 
				{ name, email, password },
				{ withCredentials: true } // allows cookies to be set
			);

			setMessage(res.data.message || "Registered successfully!");
		} catch (err) {
			if (err.response && err.response.data) {
				setMessage(err.response.data.message);
			} else {
				setMessage("Something went wrong");
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div style={{ maxWidth: "400px", margin: "0 auto" }}>
			<h2>Register</h2>
			<form onSubmit={handleSubmit}>
				<div>
					<label>Name:</label>
					<input
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
					/>
				</div>
				<div>
					<label>Email:</label>
					<input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
				</div>
				<div>
					<label>Password:</label>
					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</div>
				<button type="submit" disabled={loading}>
					{loading ? "Registering..." : "Register"}
				</button>
			</form>
			{message && <p>{message}</p>}
		</div>
	);
}

export default App;
