import express, { Request, Response, Application } from "express";
const app = express();
const PORT = 5000;

import "./database/connection";

import userRoute from "./routes/userRoute";
import productRoute from "./routes/productRoute";
import categoryRoute from "./routes/categoryRoute";
import adminSeeder from "./adminSeeder";
import categoryController from "./controllers/categoryController";
import cartRoute from "./routes/cartRoute";
app.use(express.json());

// admin seeder
adminSeeder();

// routes
app.use("", userRoute);
app.use("/admin/product", productRoute);
app.use("/admin/category", categoryRoute);
app.use("/customer/cart", cartRoute);

app.listen(PORT, () => {
  categoryController.seedCategory();
  console.log("Server listening at", PORT);
});
