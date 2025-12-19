import { Link } from "react-router-dom";
import { useCart } from "../../context/cartContext";
const Navbar = ({isAuthenticated,user,onLogout}) => {
    const {cartItems} = useCart();
	return (
		<>
			{!isAuthenticated && <p>Please login</p>}
			{isAuthenticated && user?.role == "admin" && (
				<ul className="flex gap-4">
					<li>Dashboard</li>
					<li>Products</li>
					<li>Orders</li>
					<li>Users</li>
					<li onClick={onLogout} style={{ cursor: "pointer" }}>
						Logout
					</li>
					{console.log("Navbar render:", { isAuthenticated, user })}
				</ul>
			)}
			{isAuthenticated && user?.role == "user" && (
				<ul className="flex gap-4">
					<li>Home</li>
					<Link to="/products">Products</Link>
					<Link to="/cart">Cart ({cartItems.length})</Link>
					<li>Orders</li>
					<li onClick={onLogout} style={{ cursor: "pointer" }}>
						Logout
					</li>
				</ul>
			)}
		</>
	);
};

export default Navbar;
