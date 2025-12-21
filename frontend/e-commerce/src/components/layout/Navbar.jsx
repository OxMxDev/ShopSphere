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
					<Link to="/admin/products">Manage Products</Link>
					<Link to="/admin/orders">Manage Orders</Link>
					<Link to="/admin/products/create">Create Product</Link>
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
					<Link to="/my-orders">My Orders</Link>
					<li onClick={onLogout} style={{ cursor: "pointer" }}>
						Logout
					</li>
				</ul>
			)}
		</>
	);
};

export default Navbar;
