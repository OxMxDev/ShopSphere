import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useWishlist } from "../../context/wishlistContext";
import { useCart } from "../../context/cartContext";

const ProductCard = ({ product }) => {
	const { wishlist = [], toggleWishlist } = useWishlist();
	const { addToCart } = useCart();

	const isWishlisted = wishlist?.some((item) => item._id === product._id);

	const handleAddToCart = (e) => {
		e.preventDefault();
		e.stopPropagation();
		addToCart(product._id);
	};

	return (
		<div className="bg-white rounded-lg overflow-hidden group">
			<Link to={`/products/${product._id}`}>
				{/* Product Image */}
				<div className="relative aspect-square bg-gray-50 overflow-hidden">
					<img
						src={product.images?.[0]}
						alt={product.name}
						className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
					/>
					{/* Wishlist Button */}
					<button
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							toggleWishlist(product._id);
						}}
						className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
					>
						{isWishlisted ? (
							<FaHeart className="text-red-500" />
						) : (
							<FaRegHeart className="text-gray-400" />
						)}
					</button>
				</div>

				{/* Product Info */}
				<div className="p-4">
					<h3 className="font-medium text-gray-800 mb-1 line-clamp-1">
						{product.name}
					</h3>
					<p className="text-gray-900 font-semibold">
						₹{product.price?.toLocaleString()}
					</p>
				</div>
			</Link>

			{/* Add to Cart Button */}
			<div className="px-4 pb-4">
				<button
					onClick={handleAddToCart}
					className="w-full bg-slate-800 text-white py-2.5 rounded-md text-sm font-medium hover:bg-slate-700 transition-colors"
				>
					Add to Cart
				</button>
			</div>
		</div>
	);
};

export default ProductCard;
