import { useWishlist } from "../context/wishlistContext";
import { Link } from "react-router-dom";
import { FiHeart } from "react-icons/fi";
import ProductCard from "../components/product/ProductCard";
import Loader from "../components/ui/Loader";

const Wishlist = () => {
	const { wishlist, loading } = useWishlist();

	if (loading) return <Loader />;

	if (wishlist.length === 0) {
		return (
			<div className="min-h-screen bg-white flex items-center justify-center">
				<div className="text-center">
					<FiHeart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
					<h2 className="text-xl font-semibold text-gray-800 mb-2">
						Your wishlist is empty
					</h2>
					<p className="text-gray-500 mb-6">
						Save items you like to your wishlist.
					</p>
					<Link
						to="/products"
						className="inline-block bg-slate-800 text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-slate-700 transition-colors"
					>
						Browse Products
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-white">
			<div className="max-w-7xl mx-auto px-4 py-8">
				<div className="flex items-center justify-between mb-8">
					<h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
					<p className="text-sm text-gray-500">{wishlist.length} items</p>
				</div>

				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
					{wishlist.map((product) => {
						if (!product) return null;
						return <ProductCard key={product._id} product={product} />;
					})}
				</div>
			</div>
		</div>
	);
};

export default Wishlist;
