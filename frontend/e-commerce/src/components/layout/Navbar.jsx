import React from "react";

const Navbar = ({isAuthenticated,user,onLogout}) => {
	return (
        <>
            {!isAuthenticated && <p>Please login</p>}
            {isAuthenticated && user?.role == "admin" && (
                <ul>
                    <li>Admin Dashboard</li>
                    <li onClick={onLogout} style={{cursor:"pointer"}}>Logout</li>
                </ul>
            )}
            {isAuthenticated && user?.role == "user" && (
                <ul>
                    <li>User Dashboard</li>
                    <li onClick={onLogout} style={{cursor:"pointer"}}>Logout</li>
                </ul>
            )}
        </>
    );
};

export default Navbar;
