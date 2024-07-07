"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const PORT = 5000;
require("./database/connection");
const userRoute_1 = __importDefault(require("./routes/userRoute"));
app.use(express_1.default.json());
app.use("", userRoute_1.default);
app.listen(PORT, () => {
    console.log("Server listening at", PORT);
});
