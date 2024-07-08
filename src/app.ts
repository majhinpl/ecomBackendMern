import express, { Request, Response, Application } from "express";
const app = express();
const PORT = 5000;

import "./database/connection";

import userRoute from "./routes/userRoute";
import productRoute from "./routes/productRoute";
import adminSeeder from "./adminSeeder";
app.use(express.json());

// admin seeder
adminSeeder();

// routes
app.use("", userRoute);
app.use("/admin/product", productRoute);

app.listen(PORT, () => {
  console.log("Server listening at", PORT);
});
