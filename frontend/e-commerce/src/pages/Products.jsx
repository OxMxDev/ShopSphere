import React, { useEffect, useState, useMemo } from "react";
import { getAllProducts } from "../api/product.api";
import ProductCard from "../components/product/ProductCard";
import Loader from "../components/ui/Loader";

const Products = () => {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	
	// Filter states
	const [priceRange, setPriceRange] = useState(null);
	const [selectedCategories, setSelectedCategories] = useState([]);
	const [showFilters, setShowFilters] = useState(false);

	useEffect(() => {
		getAllProducts()
			.then((res) => {
				setProducts(res.data.data.products || []);
				setError(null);
			})
			.catch((err) => {
				if (err.response?.status !== 401) {
					setError("Error fetching products");
				}
				setProducts([]);
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	// Get unique categories from products
	const categories = useMemo(() => {
		const cats = products.map(p => p.category).filter(Boolean);
		return [...new Set(cats)];
	}, [products]);

	// Get min and max price from products
	const priceStats = useMemo(() => {
		if (products.length === 0) return { min: 0, max: 100000 };
		const prices = products.map(p => p.price);
		return {
			min: 0,
			max: Math.max(...prices)
		};
	}, [products]);

	// Initialize price range when products load
	useEffect(() => {
		if (products.length > 0 && priceRange === null) {
			setPriceRange(priceStats.max);
		}
	}, [products, priceStats.max, priceRange]);

	// Get current max price for slider
	const currentMaxPrice = priceRange !== null ? priceRange : priceStats.max;

	// Filter products based on selected filters
	const filteredProducts = useMemo(() => {
		return products.filter(product => {
			// Price filter - only filter if priceRange is set
			if (priceRange !== null && product.price > priceRange) return false;
			
			// Category filter
			if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
				return false;
			}
			
			return true;
		});
	}, [products, priceRange, selectedCategories]);

	// Handle category toggle
	const toggleCategory = (category) => {
		setSelectedCategories(prev => {
			if (prev.includes(category)) {
				return prev.filter(c => c !== category);
			} else {
				return [...prev, category];
			}
		});
	};

	// Clear all filters
	const clearFilters = () => {
		setPriceRange(priceStats.max);
		setSelectedCategories([]);
	};

	if (loading) return <Loader />;

	if (error)
		return (
			<div className="min-h-screen bg-white flex items-center justify-center">
				<div className="text-center">
					<h2 className="text-xl font-semibold text-gray-700 mb-2">
						Oops! Something went wrong
					</h2>
					<p className="text-gray-500">{error}</p>
				</div>
			</div>
		);

	return (
		<div className="min-h-screen bg-white">
			<div className="max-w-7xl mx-auto px-4 py-6">
				{/* Header */}
				<div className="flex items-center justify-between mb-6">
					<p className="text-sm text-gray-600">
						Showing {filteredProducts.length} of {products.length} products
					</p>
					{(selectedCategories.length > 0 || (priceRange !== null && priceRange < priceStats.max)) && (
						<button 
							onClick={clearFilters}
							className="text-sm text-slate-600 hover:text-slate-800"
						>
							Clear filters ✕
						</button>
					)}
				</div>

				<div className="flex flex-col md:flex-row gap-8">
					{/* Filters Sidebar */}
					<div className="w-full md:w-48 flex-shrink-0">
						<div className="flex items-center justify-between md:hidden mb-4" onClick={() => setShowFilters(!showFilters)}>
							<h3 className="font-semibold text-gray-900">Filters</h3>
							<button className="text-sm text-slate-600 font-medium">
								{showFilters ? "Hide" : "Show"}
							</button>
						</div>

						<div className={`md:block ${showFilters ? 'block' : 'hidden'}`}>
							<h3 className="hidden md:block font-semibold text-gray-900 mb-4">Filters</h3>

							{/* Price Filter */}
							<div className="mb-6">
								<h4 className="text-sm font-medium text-gray-700 mb-3">Price</h4>
								<div className="flex items-center justify-between text-sm text-gray-600 mb-2">
									<span>₹0</span>
									<span>₹{currentMaxPrice.toLocaleString()}</span>
								</div>
								<input
									type="range"
									min={0}
									max={priceStats.max}
									value={currentMaxPrice}
									onChange={(e) => setPriceRange(Number(e.target.value))}
									className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-slate-800"
								/>
								<div className="flex items-center justify-between text-xs text-gray-400 mt-1">
									<span>Min</span>
									<span>Max: ₹{priceStats.max.toLocaleString()}</span>
								</div>
							</div>

							{/* Category Filter */}
							<div className="mb-6">
								<h4 className="text-sm font-medium text-gray-700 mb-3">Category</h4>
								<div className="space-y-2">
									{categories.length > 0 ? (
										categories.map((cat) => (
											<label key={cat} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
												<input 
													type="checkbox" 
													className="rounded accent-slate-800"
													checked={selectedCategories.includes(cat)}
													onChange={() => toggleCategory(cat)}
												/>
												{cat}
											</label>
										))
									) : (
										<p className="text-sm text-gray-400">No categories</p>
									)}
								</div>
							</div>

							{/* Active Filters */}
							{selectedCategories.length > 0 && (
								<div className="mb-4">
									<h4 className="text-sm font-medium text-gray-700 mb-2">Active</h4>
									<div className="flex flex-wrap gap-1">
										{selectedCategories.map(cat => (
											<span 
												key={cat}
												className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-full flex items-center gap-1"
											>
												{cat}
												<button 
													onClick={() => toggleCategory(cat)}
													className="hover:text-red-500"
												>
													×
												</button>
											</span>
										))}
									</div>
								</div>
							)}
						</div>
					</div>

					{/* Products Grid */}
					<div className="flex-1">
						{filteredProducts.length === 0 ? (
							<div className="flex flex-col items-center justify-center py-20">
								<svg
									className="w-24 h-24 text-gray-300 mb-4"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={1.5}
										d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
									/>
								</svg>
								<h2 className="text-xl font-semibold text-gray-700 mb-2">
									{products.length === 0 ? "No Products Listed Yet" : "No products match your filters"}
								</h2>
								<p className="text-gray-500 text-center max-w-md">
									{products.length === 0 
										? "Our shop is getting ready! Check back soon for amazing products."
										: "Try adjusting your filters to see more products."
									}
								</p>
								{products.length > 0 && (
									<button
										onClick={clearFilters}
										className="mt-4 text-sm text-slate-600 hover:text-slate-800 underline"
									>
										Clear all filters
									</button>
								)}
							</div>
						) : (
							<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
								{filteredProducts.map((product) => (
									<ProductCard key={product._id} product={product} />
								))}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Products;
