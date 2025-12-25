import { FaStar, FaRegStar } from "react-icons/fa";

const Rating = ({ value = 0, editable = false, onRate }) => {
	return (
		<div className="flex gap-1">
			{[1, 2, 3, 4, 5].map((star) => (
				<span
					key={star}
					onClick={() => editable && onRate(star)}
					className={editable ? "cursor-pointer" : ""}
				>
					{value >= star ? (
						<FaStar className="text-yellow-400" />
					) : (
						<FaRegStar className="text-yellow-400" />
					)}
				</span>
			))}
		</div>
	);
};

export default Rating;
