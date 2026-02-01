import { Link, useLocation } from "react-router-dom";
import { useCart } from "../../context/cartContext";
import { FiShoppingCart, FiUser } from "react-icons/fi";

const Navbar = ({ isAuthenticated, user, onLogout }) => {
	const { cartItems } = useCart();
	const location = useLocation();

	const isActive = (path) => location.pathname === path;

	if (!isAuthenticated) {
		return null;
	}

	return (
		<nav className="bg-slate-800 sticky top-0 z-50">
			<div className="max-w-7xl mx-auto px-6">
				<div className="flex items-center justify-between h-14">
					{/* Navigation Links */}
					<div className="flex items-center gap-8">
						{user?.role === "admin" ? (
							<>
								<Link
									to="/admin/dashboard"
									className={`text-sm transition-colors ${
										isActive("/admin/dashboard")
											? "text-white"
											: "text-gray-300 hover:text-white"
									}`}
								>
									Dashboard
								</Link>
								<Link
									to="/admin/products"
									className={`text-sm transition-colors ${
										isActive("/admin/products")
											? "text-white"
											: "text-gray-300 hover:text-white"
									}`}
								>
									Products
								</Link>
								<Link
									to="/admin/orders"
									className={`text-sm transition-colors ${
										isActive("/admin/orders")
											? "text-white"
											: "text-gray-300 hover:text-white"
									}`}
								>
									Orders
								</Link>
								<Link
									to="/admin/products/create"
									className={`text-sm transition-colors ${
										isActive("/admin/products/create")
											? "text-white"
											: "text-gray-300 hover:text-white"
									}`}
								>
									Create
								</Link>
							</>
						) : (
							<>
								<Link
									to="/"
									className={`text-sm transition-colors ${
										isActive("/")
											? "text-white"
											: "text-gray-300 hover:text-white"
									}`}
								>
									Home
								</Link>
								<Link
									to="/products"
									className={`text-sm transition-colors ${
										isActive("/products")
											? "text-white"
											: "text-gray-300 hover:text-white"
									}`}
								>
									Shop
								</Link>
								<Link
									to="/my-orders"
									className={`text-sm transition-colors ${
										isActive("/my-orders")
											? "text-white"
											: "text-gray-300 hover:text-white"
									}`}
								>
									My Orders
								</Link>
								<Link
									to="/wishlist"
									className={`text-sm transition-colors ${
										isActive("/wishlist")
											? "text-white"
											: "text-gray-300 hover:text-white"
									}`}
								>
									Wishlist
								</Link>
							</>
						)}
					</div>

					{/* Right Side - Cart & Logout */}
					<div className="flex items-center gap-6">
						{user?.role === "user" && (
							<Link
								to="/cart"
								className="relative text-gray-300 hover:text-white transition-colors"
							>
								<FiShoppingCart className="text-xl" />
								{cartItems.length > 0 && (
									<span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
										{cartItems.length}
									</span>
								)}
							</Link>
						)}
						<Link
							to="/profile"
							className={`text-sm transition-colors ${
								isActive("/profile")
									? "text-white"
									: "text-gray-300 hover:text-white"
							}`}
						>
							<FiUser className="text-xl" />
						</Link>
						<button
							onClick={onLogout}
							className="text-sm text-gray-300 hover:text-white transition-colors"
						>
							Logout
						</button>
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
