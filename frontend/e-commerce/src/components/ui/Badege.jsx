const Badge = ({ text, type = "default" }) => {
	const styles = {
		success: "bg-green-100 text-green-700",
		danger: "bg-red-100 text-red-700",
		warning: "bg-yellow-100 text-yellow-700",
		info: "bg-blue-100 text-blue-700",
		default: "bg-gray-100 text-gray-700",
	};

	return (
		<span className={`px-2 py-1 text-xs font-semibold rounded ${styles[type]}`}>
			{text}
		</span>
	);
};

export default Badge;
