import express, { Router } from "express";
import authMiddleware, { Role } from "../middleware/authMiddleware";
const router: Router = express.Router();
import { multer, storage } from "../middleware/multerMiddleware";
import productController from "../controllers/productController";
import errorHandler from "../services/catchAsyncError";

const upload = multer({ storage: storage });

router
  .route("/")
  .post(
    authMiddleware.isAuthenticated,
    authMiddleware.restrictTo(Role.Admin),
    upload.single("image"),
    errorHandler(productController.addProduct)
  )
  .get(errorHandler(productController.getAllProduct));

router
  .route("/:id")
  .get(errorHandler(productController.getSingleProduct))
  .delete(
    authMiddleware.isAuthenticated,
    authMiddleware.restrictTo(Role.Admin),
    errorHandler(productController.deleteProduct)
  );

export default router;
