import React, { useEffect, useState } from 'react'
import { getAllProducts } from '../api/product.api'
import { getAllOrders } from '../api/order.api'
import { getAllCategories } from '../api/category.api'
import { FaBox } from "react-icons/fa6";
import { RiFile2Fill } from "react-icons/ri";
import { IoBagHandle } from "react-icons/io5";
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
			<ul className="flex w-full gap-6 p-4 rounded-lg">
				<li className="p-6 w-[20%] bg-white rounded-2xl relative shadow-xl text-gray-400">
					Total Products
					<p className='text-black'>{products}</p>
					<FaBox
						size={40}
						className="absolute right-4 top-8 mt-2 text-blue-400"
					/>
				</li>
				<li className="p-6 w-[20%] text-gray-400 bg-white rounded-2xl shadow-xl relative">
					Total Orders
					<p className='text-black'>{orders}</p>
					<RiFile2Fill
						size={40}
						className="absolute right-4 top-8 mt-2 text-green-300"
					/>
				</li>
				<li className="p-6 w-[20%] text-gray-400 bg-white rounded-2xl shadow-xl relative">
					Total Categories
					<p className='text-black'>{categories}</p>
					<IoBagHandle
						size={40}
						className="mt-2 text-purple-400 absolute right-4 top-8"
					/>
				</li>
			</ul>
		</div>
	);
}

export default Dashboard