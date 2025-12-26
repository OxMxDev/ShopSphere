import { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser } from "../api/auth.api";

const AuthContext = createContext(null);
export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const res = await getCurrentUser();
				setUser(res.data.data);
				setIsAuthenticated(true);
			} catch (err) {
				setUser(null);
				setIsAuthenticated(false);
			} finally {
				setLoading(false);
			}
		};

		fetchUser();
	}, []);

	return (
		<AuthContext.Provider
			value={{
				user,
				isAuthenticated,
				setUser,
				setIsAuthenticated,
				loading,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
export const useAuth = () => {
	return useContext(AuthContext);
};
