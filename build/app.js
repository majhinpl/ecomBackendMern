"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const PORT = 5000;
require("./database/connection");
app.get("/", (req, res) => {
    res.send("Hello World");
});
app.get("/about", (req, res) => {
    console.log("This is about page");
});
app.listen(PORT, () => {
    console.log("Server listening at", PORT);
});
