📦 MERN E-Commerce Platform

A full-stack **E-commerce web application** built using the **MERN stack**, featuring authentication, role-based access, product management, cart, orders, wishlist, and reviews.

---

## 🚀 Features

### 👤 Authentication & Authorization
- User registration & login
- JWT authentication with HTTP-only cookies
- Role-based access (User / Admin)
- Protected routes (frontend & backend)

### 🛍 Product Management
- Product listing & product details page
- Product image upload (Cloudinary)
- Admin CRUD operations
- Stock management
- Category & brand support

### 🛒 Cart & Checkout
- Add/remove products from cart
- Increase/decrease quantity
- Persistent backend-driven cart
- Checkout with shipping address
- Order creation

### 📦 Orders
- User order history
- Admin order management
- Order status updates
- Automatic stock reduction after order

### ❤️ Wishlist
- Add/remove products to wishlist
- Wishlist page (protected route)
- Backend-synced wishlist state

### ⭐ Reviews & Ratings
- Add product reviews & ratings
- Prevent duplicate reviews
- Edit/delete own reviews
- Automatic average rating calculation

---

## 🧱 Tech Stack

### Frontend
- React (Vite)
- React Router
- Context API
- Tailwind CSS
- Axios

### Backend
- Node.js
- Express.js
- MongoDB & Mongoose
- JWT Authentication
- Multer
- Cloudinary

---

## 🗂 Project Structure

```bash
frontend/
 ├── src/
 │   ├── api/
 │   ├── components/
 │   ├── context/
 │   ├── pages/
 │   ├── routes/
 │   └── utils/

backend/
 ├── src/
 │   ├── controllers/
 │   ├── models/
 │   ├── routes/
 │   ├── middlewares/
 │   └── utils/

```
🔐 Authentication Flow

JWT-based authentication

Tokens stored in HTTP-only cookies

Auth state handled using Context API

Protected routes prevent unauthorized access

🧠 Key Learnings

REST API design with proper validation

Secure authentication & authorization

Global state management using Context API

Frontend–backend integration

Handling async flows & race conditions

Image upload & cloud storage

Debugging real-world production issues

⚙️ Environment Variables
Backend (.env)
PORT=3000
MONGO_URI=your_mongodb_url
JWT_SECRET=your_jwt_secret
CORS_ORIGIN=http://localhost:5173
CLOUDINARY_CLOUD_NAME=xxxx
CLOUDINARY_API_KEY=xxxx
CLOUDINARY_API_SECRET=xxxx

Frontend (.env)
VITE_BACKEND_URL=http://localhost:3000/api/v1

▶️ Run Locally
Backend
cd backend
npm install
npm run dev

Frontend
cd frontend
npm install
npm run dev

📸 Screenshots
<img width="852" height="906" alt="Screenshot 2025-12-29 160548" src="https://github.com/user-attachments/assets/ed6853af-0aca-4f76-96c8-21a790418677" />
<img width="1919" height="915" alt="Screenshot 2025-12-29 160633" src="https://github.com/user-attachments/assets/17c04ca3-7889-4579-b53f-4a4e291b4125" />
<img width="1895" height="919" alt="Screenshot 2025-12-29 160654" src="https://github.com/user-attachments/assets/cbf81c98-14cb-4f69-af95-f67e939bcd35" />
<img width="1919" height="914" alt="Screenshot 2025-12-29 160709" src="https://github.com/user-attachments/assets/0a51e9b7-3217-451f-94ef-e50aaf23e092" />
<img width="1919" height="914" alt="Screenshot 2025-12-29 160719" src="https://github.com/user-attachments/assets/19bb409b-71ec-4190-9879-5b66ca87865d" />
<img width="1919" height="917" alt="Screenshot 2025-12-29 160727" src="https://github.com/user-attachments/assets/9ff40a1f-2abc-4aa8-b792-c66ff97646a0" />

📌 Future Improvements

Payment gateway integration

Product search & pagination

Admin analytics dashboard

Email notifications

👨‍💻 Author

Om Dwivedi
Aspiring Full-Stack Developer

⭐ Acknowledgements

Inspired by modern e-commerce platforms

Built as a learning-focused MERN project






