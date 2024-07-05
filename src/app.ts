import express, { Request, Response, Application } from "express";
const app = express();
const PORT = 5000;
import "./database/connection";


app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

app.get("/about", (req: Request, res: Response) => {
  console.log("This is about page");
});

app.listen(PORT, () => {
  console.log("Server listening at", PORT);
});
