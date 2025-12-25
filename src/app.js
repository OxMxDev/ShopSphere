import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
app.use(
	cors({
		origin: process.env.CORS_ORIGIN,
		credentials: true,
	})
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use((req, res, next) => {
	console.log("Full URL:", req.originalUrl);
	console.log("Path:", req.path);
	console.log("Base URL:", req.baseUrl);
	console.log("IP:", req.ip);
	console.log("Origin:", req.get("origin"));
	next();
});
console.log("CROS ORIGIN",process.env.CORS_ORIGIN);
import userRouter from "./routes/user.route.js";
import productRouter from "./routes/product.route.js";
import adminRouter from "./routes/admin.route.js";
import cartRouter from "./routes/cart.route.js";
import orderRouter from "./routes/order.route.js";
import categoryRouter from "./routes/category.route.js";
import wishlistRouter from "./routes/wishlist.route.js";
import reviewRouter from "./routes/review.route.js";
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/admins", adminRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/wishlist", wishlistRouter);
app.use(
	"/api/v1/reviews",
	reviewRouter
);
export { app };
