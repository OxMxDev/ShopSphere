import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../../context/cartContext";
import { FiShoppingCart, FiUser, FiMenu, FiX } from "react-icons/fi";

const Navbar = ({ isAuthenticated, user, onLogout }) => {
	const { cartItems } = useCart();
	const location = useLocation();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	const isActive = (path) => location.pathname === path;

	if (!isAuthenticated) {
		return null;
	}

	const userLinks = [
		{ to: "/", label: "Home" },
		{ to: "/products", label: "Shop" },
		{ to: "/my-orders", label: "My Orders" },
		{ to: "/wishlist", label: "Wishlist" },
	];

	const adminLinks = [
		{ to: "/admin/dashboard", label: "Dashboard" },
		{ to: "/admin/products", label: "Products" },
		{ to: "/admin/orders", label: "Orders" },
		{ to: "/admin/products/create", label: "Create" },
	];

	const links = user?.role === "admin" ? adminLinks : userLinks;

	return (
		<nav className="bg-slate-800 sticky top-0 z-50">
			<div className="max-w-7xl mx-auto px-4 md:px-6">
				<div className="flex items-center justify-between h-14">
					<button
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
						className="md:hidden text-gray-300 hover:text-white"
					>
						{mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
					</button>

					<div className="hidden md:flex items-center gap-8">
						{links.map((link) => (
							<Link
								key={link.to}
								to={link.to}
								className={`text-sm transition-colors ${
									isActive(link.to)
										? "text-white"
										: "text-gray-300 hover:text-white"
								}`}
							>
								{link.label}
							</Link>
						))}
					</div>

					<div className="flex items-center gap-4 md:gap-6">
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
							className={`transition-colors ${
								isActive("/profile")
									? "text-white"
									: "text-gray-300 hover:text-white"
							}`}
						>
							<FiUser className="text-xl" />
						</Link>
						<button
							onClick={onLogout}
							className="text-sm text-gray-300 hover:text-white transition-colors hidden md:block"
						>
							Logout
						</button>
					</div>
				</div>
			</div>

			{mobileMenuOpen && (
				<div className="md:hidden bg-slate-900 border-t border-slate-700">
					<div className="px-4 py-3 space-y-2">
						{links.map((link) => (
							<Link
								key={link.to}
								to={link.to}
								onClick={() => setMobileMenuOpen(false)}
								className={`block py-2 px-3 rounded-lg text-sm ${
									isActive(link.to)
										? "bg-slate-700 text-white"
										: "text-gray-300 hover:bg-slate-700 hover:text-white"
								}`}
							>
								{link.label}
							</Link>
						))}
						<button
							onClick={() => {
								onLogout();
								setMobileMenuOpen(false);
							}}
							className="w-full text-left py-2 px-3 rounded-lg text-sm text-gray-300 hover:bg-slate-700 hover:text-white"
						>
							Logout
						</button>
					</div>
				</div>
			)}
		</nav>
	);
};

export default Navbar;
