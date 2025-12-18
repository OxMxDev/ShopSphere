import React from "react";

const Navbar = ({isAuthenticated,user,onLogout}) => {
	return (
        <>
            {!isAuthenticated && <p>Please login</p>}
            {isAuthenticated && user?.role == "admin" && (
                <ul className="flex gap-4">
                    <li>Dashboard</li>
                    <li>Products</li>
                    <li>Orders</li>
                    <li>Users</li>
                    <li onClick={onLogout} style={{cursor:"pointer"}}>Logout</li>
                    {console.log("Navbar render:", { isAuthenticated, user })
}
                </ul>
            )}
            {isAuthenticated && user?.role == "user" && (
                <ul className="flex gap-4">
                    <li>Home</li>
                    <li>Products</li>
                    <li>Cart</li>
                    <li>Orders</li>
                    <li onClick={onLogout} style={{cursor:"pointer"}}>Logout</li>
                </ul>
            )}
        </>
    );
};

export default Navbar;
