import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useWishlist } from "../../context/wishlistContext";
const ProductCard = ({ product }) => {
	const { wishlist = [], toggleWishlist } = useWishlist();

	const isWishlisted = wishlist?.some((item) => item._id === product._id);

	return (
		<Link to={`/products/${product._id}`}>
			<div className="rounded-lg p-4 w-64 bg-white shadow-xl">
				<img
					src={product.images?.[0]}
					alt={product.name}
					className="w-full h-60 object-cover rounded"
				/>

				<h3 className="font-semibold mt-2">{product.name}</h3>
				<p className="text-sm text-gray-600 truncate">{product.description}</p>
				<p className=" ">Rating {product.ratings}⭐</p>
				<p className="font-semibold mt-1">₹{product.price}</p>
				<button
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
						toggleWishlist(product._id);
					}}
				>
					{isWishlisted ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
				</button>
			</div>
		</Link>
	);
};

export default ProductCard;
