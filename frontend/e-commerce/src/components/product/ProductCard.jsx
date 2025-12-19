import { Link } from "react-router-dom";
const ProductCard = ({ product }) => {
	return (
		<Link to={`/products/${product._id}`}>
		<div className="border rounded-lg p-4 w-64">
			<img
				src={product.images?.[0]}
				alt={product.name}
				className="w-full h-60 object-cover rounded"
			/>

			<h3 className="font-bold mt-2">{product.name}</h3>
			<p className="text-sm text-gray-600">{product.description}</p>

			<p className="text-green-600 font-semibold mt-1">₹{product.price}</p>
		</div>
		</Link>
	);
};

export default ProductCard;
