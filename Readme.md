📖 Overview

A full-stack e-commerce web application built using Node.js, Express, MongoDB, and Mongoose, with features like authentication, product management, and user profiles.
This README documents the project setup, folder structure, APIs, and development workflow.


🚀 Features

🧾 User authentication (JWT-based login, signup, refresh tokens)

🛒 Product CRUD (add, update, delete, view)

💳 Secure checkout flow

📦 Order management (user + admin view)

🖼️ Image uploads with Cloudinary

⚙️ RESTful API design

🧠 Mongoose models with pre/post middleware

🧩 Tech Stack
Category	                    Technologies
Backend	                        Node.js, Express.js
Database	                    MongoDB, Mongoose
Authentication	                JWT, bcrypt
Cloud	                        Cloudinary
Testing	                        Postman
Environment Management	        dotenv

🗂️ Folder Structure

EcommerceWebsite/
│
├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   ├── utils/
│   ├── db/
│   └── app.js
│   └── constants.js
│   └── index.js
│
├── .env
├── .gitignore
├── package.json
├── README.md

⚙️ Installation & Setup

# Clone the repository
git clone https://github.com/OxMxDev/ShopSphere.git

# Go to project directory
cd EcommerceWebsite

# Install dependencies
npm install

# Create a .env file and configure environment variables
# Example:
# MONGODB_URI=mongodb+srv://...
# JWT_SECRET=your_secret
# CLOUDINARY_URL=...

# Run the server (development)
npm run dev

🧰 Scripts

Command             Description

npm run dev         Start server with nodemon

🧑‍💻 Developer Notes

Uses Mongoose middleware for token handling and validations

Access & Refresh tokens handled via generateAccessAndRefreshTokens() in auth.controller.js

Error handling centralized with a custom ApiError class


