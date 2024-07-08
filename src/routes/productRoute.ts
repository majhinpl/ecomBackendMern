import express, { Router } from "express";
import authMiddleware, { Role } from "../middleware/authMiddleware";
const router: Router = express.Router();
import { multer, storage } from "../middleware/multerMiddleware";
import ProductController from "../controllers/productController";
import productController from "../controllers/productController";

const upload = multer({ storage: storage });

router
  .route("/")
  .post(
    authMiddleware.isAuthenticated,
    authMiddleware.restrictTo(Role.Admin),
    upload.single("image"),
    ProductController.addProduct
  )
  .get(productController.getAllProduct);

export default router;
