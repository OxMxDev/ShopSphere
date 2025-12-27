import { useWishlist } from "../context/wishlistContext";
import PageContainer from "../components/layout/PageContainer";

const Wishlist = () => {
	const { wishlist, loading } = useWishlist();

	if (loading) return <p>Loading wishlist...</p>;

	if (wishlist.length === 0) {
		return <p className="text-center">Your wishlist is empty</p>;
	}

	return (
		<PageContainer>
			<h2 className="text-xl font-bold mb-4">My Wishlist</h2>

			{wishlist.map(({ product }) => (
				<div
					key={product._id}
					className="border p-4 mb-2 rounded flex justify-between"
				>
					<div>
						<p className="font-semibold">{product.name}</p>
						<p>₹{product.price}</p>
					</div>
				</div>
			))}
		</PageContainer>
	);
};

export default Wishlist;
