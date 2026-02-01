import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
	const categories = [
		{ name: "Smartphones", image: "📱" },
		{ name: "Electronics", image: "💻" },
		{ name: "Fashion", image: "👕" },
		{ name: "Accessories", image: "👜" },
	];

	return (
		<div className="min-h-screen bg-white">
			{/* Hero Banner */}
			<div className="max-w-6xl mx-auto px-4 py-8">
				<div className="relative bg-gray-100 rounded-2xl overflow-hidden">
					<div className="flex flex-col md:flex-row items-center">
						{/* Text Content */}
						<div className="p-8 md:p-12 md:w-1/2">
							<h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
								Summer Sale!
								<br />
								Up to 50% Off
							</h1>
							<Link
								to="/products"
								className="inline-block bg-slate-800 text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-slate-700 transition-colors"
							>
								Shop Now
							</Link>
						</div>
						{/* Hero Image Placeholder */}
						<div className="md:w-1/2 h-64 md:h-80 bg-gradient-to-br from-orange-200 to-orange-300 flex items-center justify-center">
							<span className="text-8xl">🛍️</span>
						</div>
					</div>
				</div>
			</div>

			{/* Categories Section */}
			<div className="max-w-6xl mx-auto px-4 py-12">
				<div className="grid grid-cols-2 sm:grid-cols-4 gap-8 md:gap-16 place-items-center">
					{categories.map((cat, idx) => (
						<Link
							key={idx}
							to="/products"
							className="flex flex-col items-center group w-full"
						>
							<div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gray-100 flex items-center justify-center text-3xl md:text-4xl mb-3 group-hover:bg-gray-200 transition-colors">
								{cat.image}
							</div>
							<span className="text-sm text-gray-700 font-medium text-center">
								{cat.name}
							</span>
						</Link>
					))}
				</div>
			</div>

			{/* Featured Section */}
			<div className="max-w-6xl mx-auto px-4 py-8">
				<div className="flex items-center justify-between mb-6">
					<h2 className="text-xl font-semibold text-gray-900">
						Featured Products
					</h2>
					<Link
						to="/products"
						className="text-sm text-slate-600 hover:text-slate-800"
					>
						View All →
					</Link>
				</div>
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					{[1, 2, 3, 4].map((i) => (
						<Link
							key={i}
							to="/products"
							className="bg-gray-50 rounded-lg p-4 aspect-square flex items-center justify-center hover:bg-gray-100 transition-colors"
						>
							<span className="text-gray-400 text-sm">Browse Products</span>
						</Link>
					))}
				</div>
			</div>
		</div>
	);
};

export default Home;
