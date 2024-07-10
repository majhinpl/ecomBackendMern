import { Sequelize } from "sequelize-typescript";

import dotenv from "dotenv";
import User from "./models/userModel";
import Product from "./models/productModel";
import Category from "./models/categoryModel";
import Cart from "./models/cartModel";
dotenv.config();

const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  dialect: "mysql",
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD || undefined, // Handle empty password case
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  models: [__dirname + "/models"],
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

// relationships
User.hasMany(Product, { foreignKey: "userId" });
Product.belongsTo(User, { foreignKey: "userId" });

Category.hasOne(Product, { foreignKey: "categoryId" });
Product.belongsTo(Category, { foreignKey: "categoryId" });

// Product-cart relation
User.hasMany(Cart, { foreignKey: "userId" });
Cart.belongsTo(User, { foreignKey: "userId" });

// user-cart relation
Product.hasMany(Cart, { foreignKey: "productId" });
Cart.belongsTo(Product, { foreignKey: "productId" });

export default sequelize;
