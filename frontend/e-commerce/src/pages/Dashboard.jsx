import React, { useEffect, useState } from 'react'
import { getAllProducts } from '../api/product.api'
import { getAllOrders } from '../api/order.api'
import { getAllCategories } from '../api/category.api'
import Badge from '../components/ui/Badege'
const Dashboard = () => {
    const [products,setProducts] = useState(0)
    const [orders,setOrders] = useState(0)
    const [categories,setCategories] = useState(0)
    useEffect(()=>{
        getAllProducts().then((res)=>{
            setProducts(res.data.data.total)
        }).catch((err)=>{
            console.log(err);
        })
        getAllOrders().then((res)=>{
            setOrders(res.data.data.length)
        }).catch((err)=>{
            console.log(err);
        })
        getAllCategories().then((res)=>{
            setCategories(res.data.data.length)
            console.log(res.data.data);
        }).catch((err)=>{
            console.log(err);
        })
    },[])
  return (
		<div className="flex flex-col gap-4 p-6">
			<p className="text-3xl">Dashboard Overview</p>
			<ul className="flex w-full justify-around bg-gray-100 p-4 rounded-lg">
				<li className="p-4 border bg-white rounded-2xl shadow-xl">
					Total Products: {products}
				</li>
				<li className="p-4 border bg-white rounded-2xl shadow-xl">
					Total Orders: {orders}
				</li>
				<li className="p-4 border bg-white rounded-2xl shadow-xl">
					Total Categories: {categories}
				</li>
			</ul>
		</div>
	);
}

export default Dashboard