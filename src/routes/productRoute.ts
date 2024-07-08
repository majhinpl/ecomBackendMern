import express, { Router } from "express";
import authMiddleware, { Role } from "../middleware/authMiddleware";
const router: Router = express.Router();
import { multer, storage } from "../middleware/multerMiddleware";
import ProductController from "../controllers/productController";

const upload = multer({ storage: storage });

router
  .route("/")
  .post(
    authMiddleware.isAuthenticated,
    authMiddleware.restrictTo(Role.Admin),
    upload.single("image"),
    ProductController.addProduct
  );

export default router;
