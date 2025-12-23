import React, { useEffect, useState } from 'react'
import { getAllProducts } from '../api/product.api'
import { getAllOrders } from '../api/order.api'
const Dashboard = () => {
    const [products,setProducts] = useState(0)
    const [orders,setOrders] = useState(0)
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
    },[])
  return (
    <div>
        Dashboard Overview
        <div>Total Products: {products}</div>
        <div>Total Orders: {orders}</div>
    </div>
  )
}

export default Dashboard