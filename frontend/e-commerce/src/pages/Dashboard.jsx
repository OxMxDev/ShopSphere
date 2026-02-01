import React, { useEffect, useState } from 'react'
import { getAllProducts } from '../api/product.api'
import { getAllOrders } from '../api/order.api'
import { getAllCategories } from '../api/category.api'
import { FiPackage, FiShoppingBag, FiGrid, FiTrendingUp, FiDollarSign, FiUsers } from "react-icons/fi";
import Loader from '../components/ui/Loader';

const Dashboard = () => {
	const [products, setProducts] = useState(0);
	const [orders, setOrders] = useState([]);
	const [categories, setCategories] = useState(0);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		Promise.all([
			getAllProducts(),
			getAllOrders(),
			getAllCategories()
		]).then(([productsRes, ordersRes, categoriesRes]) => {
			setProducts(productsRes.data.data.total);
			setOrders(ordersRes.data.data);
			setCategories(categoriesRes.data.data.length);
		}).catch((err) => {
			console.log(err);
		}).finally(() => {
			setLoading(false);
		});
	}, []);

	if (loading) return <Loader />;

	const totalRevenue = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
	const pendingOrders = orders.filter(order => !order.isDelievered).length;

	const stats = [
		{
			title: "Total Products",
			value: products,
			icon: FiPackage,
			color: "bg-blue-500",
			bgColor: "bg-blue-50",
		},
		{
			title: "Total Orders",
			value: orders.length,
			icon: FiShoppingBag,
			color: "bg-green-500",
			bgColor: "bg-green-50",
		},
		{
			title: "Categories",
			value: categories,
			icon: FiGrid,
			color: "bg-purple-500",
			bgColor: "bg-purple-50",
		},
		{
			title: "Revenue",
			value: `₹${totalRevenue.toLocaleString()}`,
			icon: FiDollarSign,
			color: "bg-amber-500",
			bgColor: "bg-amber-50",
		},
	];

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto px-4 py-8">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
					<p className="text-gray-500 mt-1">Welcome back! Here's what's happening with your store.</p>
				</div>

				{/* Stats Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
					{stats.map((stat, index) => (
						<div key={index} className="bg-white rounded-xl p-6 shadow-sm">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-gray-500 mb-1">{stat.title}</p>
									<p className="text-2xl font-bold text-gray-900">{stat.value}</p>
								</div>
								<div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
									<stat.icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
								</div>
							</div>
						</div>
					))}
				</div>

				{/* Quick Stats */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{/* Pending Orders */}
					<div className="bg-white rounded-xl p-6 shadow-sm">
						<div className="flex items-center gap-3 mb-4">
							<div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
								<FiTrendingUp className="w-5 h-5 text-yellow-500" />
							</div>
							<h3 className="font-semibold text-gray-900">Pending Deliveries</h3>
						</div>
						<p className="text-3xl font-bold text-gray-900">{pendingOrders}</p>
						<p className="text-sm text-gray-500 mt-1">orders awaiting delivery</p>
					</div>

					{/* Recent Activity */}
					<div className="bg-white rounded-xl p-6 shadow-sm">
						<div className="flex items-center gap-3 mb-4">
							<div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center">
								<FiUsers className="w-5 h-5 text-slate-500" />
							</div>
							<h3 className="font-semibold text-gray-900">Recent Orders</h3>
						</div>
						{orders.length === 0 ? (
							<p className="text-gray-500">No orders yet</p>
						) : (
							<div className="space-y-3">
								{orders.slice(0, 3).map((order) => (
									<div key={order._id} className="flex items-center justify-between text-sm">
										<span className="text-gray-600">Order #{order._id.slice(-6).toUpperCase()}</span>
										<span className="font-medium">₹{order.totalPrice?.toLocaleString()}</span>
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

export default Dashboard