const Loader = ({ className = "h-40", spinnerSize = "h-8 w-8", spinnerColor = "border-blue-600" }) => {
	return (
		<div className={`flex justify-center items-center ${className}`}>
			<div className={`animate-spin rounded-full ${spinnerSize} border-t-2 ${spinnerColor}`}></div>
		</div>
	);
};

export default Loader;
