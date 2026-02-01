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

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    message: message,
    errors: err.errors || [],
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined
  });
});

export { app };
