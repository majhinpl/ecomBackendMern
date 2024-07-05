"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const sequelize = new sequelize_typescript_1.Sequelize({
    database: process.env.DB_NAME,
    dialect: "mysql", // Change to "mysql"
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD || undefined, // Handle empty password case
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    models: [__dirname + "/model"],
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
});
sequelize
    .authenticate()
    .then(() => {
    console.log("Connected");
})
    .catch((err) => {
    console.error("Unable to connect to the database:", err);
});
sequelize
    .sync({ force: false })
    .then(() => {
    console.log("Synced !!!");
})
    .catch((err) => {
    console.error("Error syncing database:", err);
});
exports.default = sequelize;
