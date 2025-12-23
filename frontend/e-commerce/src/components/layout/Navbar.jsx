import { Link } from "react-router-dom";
import { useCart } from "../../context/cartContext";
import PageContainer from "./PageContainer";
const Navbar = ({ isAuthenticated, user, onLogout }) => {
	const { cartItems } = useCart();
	return (
		<>
			<PageContainer>
				{!isAuthenticated && <p>Please login</p>}
				{isAuthenticated && user?.role == "admin" && (
					<ul className="flex gap-4 bg-white rounded-xl p-6 shadow-md w-full">
						<Link to="/admin/dashboard" className="hover:{shadow-md border}">
							Dashboard
						</Link>
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
						<Link to="/checkout">Checkout</Link>
						<Link to="/products">Products</Link>
						<Link to="/cart">Cart ({cartItems.length})</Link>
						<Link to="/my-orders">My Orders</Link>
						<li onClick={onLogout} style={{ cursor: "pointer" }}>
							Logout
						</li>
					</ul>
				)}
			</PageContainer>
		</>
	);
};

export default Navbar;
