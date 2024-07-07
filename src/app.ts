import express, { Request, Response, Application } from "express";
const app = express();
const PORT = 5000;
import "./database/connection";

import userRoute from "./routes/userRoute";
app.use(express.json());

app.use("", userRoute);

app.listen(PORT, () => {
  console.log("Server listening at", PORT);
});
