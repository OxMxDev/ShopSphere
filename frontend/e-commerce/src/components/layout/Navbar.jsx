import { Link } from "react-router-dom";
import { useCart } from "../../context/cartContext";
import PageContainer from "./PageContainer";
const Navbar = ({ isAuthenticated, user, onLogout }) => {
	const { cartItems } = useCart();
	return (
		<>
			{!isAuthenticated && <p>Please login</p>}
			{isAuthenticated && user?.role == "admin" && (
				<ul className="flex gap-4 relative rounded-xl p-6 shadow-mdw-full">
					<Link
						to="/admin/dashboard"
						className="hover:scale-105 transition-all hover:shadow-lg hover:bg-gray-100 rounded-lg p-2"
					>
						Dashboard
					</Link>
					<Link
						to="/admin/products"
						className="hover:scale-105 transition-all hover:shadow-lg hover:bg-gray-100 rounded-lg p-2"
					>
						Manage Products
					</Link>
					<Link
						to="/admin/orders"
						className="hover:scale-105 transition-all hover:shadow-lg hover:bg-gray-100 rounded-lg p-2"
					>
						Manage Orders
					</Link>
					<Link
						to="/admin/products/create"
						className="hover:scale-105 transition-all hover:shadow-lg hover:bg-gray-100 rounded-lg p-2"
					>
						Create Product
					</Link>
					<li
						onClick={onLogout}
						style={{ cursor: "pointer" }}
						className="hover:scale-105 transition-all hover:shadow-lg hover:bg-red-100 rounded-lg p-2 absolute right-6 text-red-500"
					>
						Logout
					</li>
					{console.log("Navbar render:", { isAuthenticated, user })}
				</ul>
			)}
			{isAuthenticated && user?.role == "user" && (
				<ul className="flex gap-4 relative rounded-xl p-6 shadow-mdw-full">
					<Link
						to="/checkout"
						className="hover:scale-105 transition-all hover:shadow-lg hover:bg-gray-100 rounded-lg p-2"
					>
						Checkout
					</Link>
					<Link
						to="/products"
						className="hover:scale-105 transition-all hover:shadow-lg hover:bg-gray-100 rounded-lg p-2"
					>
						Products
					</Link>
					<Link
						to="/cart"
						className="hover:scale-105 transition-all hover:shadow-lg hover:bg-gray-100 rounded-lg p-2"
					>
						Cart ({cartItems.length})
					</Link>
					<Link to="/my-orders" className="hover:scale-105 transition-all hover:shadow-lg hover:bg-gray-100 rounded-lg p-2">
						My Orders
					</Link>
					<li onClick={onLogout} style={{ cursor: "pointer" }} className="hover:scale-105 transition-all hover:shadow-lg hover:bg-red-100 rounded-lg p-2 absolute right-6 text-red-500">
						Logout
					</li>
				</ul>
			)}
		</>
	);
};

export default Navbar;
