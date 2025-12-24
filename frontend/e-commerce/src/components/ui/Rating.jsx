import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const Rating = ({ value, text, onRate, editable = false }) => {
	const handleClick = (rating) => {
		if (!editable || !onRate) return;
		onRate(rating);
	};

	return (
		<div className="flex items-center gap-1">
			{[1, 2, 3, 4, 5].map((star) => (
				<span
					key={star}
					onClick={() => handleClick(star)}
					className={editable ? "cursor-pointer" : ""}
				>
					{value >= star ? (
						<FaStar className="text-yellow-400" />
					) : value >= star - 0.5 ? (
						<FaStarHalfAlt className="text-yellow-400" />
					) : (
						<FaRegStar className="text-yellow-400" />
					)}
				</span>
			))}
			{text && <span className="text-sm text-gray-500 ml-1">{text}</span>}
		</div>
	);
};

export default Rating;
