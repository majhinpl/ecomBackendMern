import express, { Router } from "express";
import authMiddleware, { Role } from "../middleware/authMiddleware";
import categoryController from "../controllers/categoryController";
import errorHandler from "../services/catchAsyncError";
const router: Router = express.Router();

router
  .route("/")
  .post(
    authMiddleware.isAuthenticated,
    authMiddleware.restrictTo(Role.Admin),
    errorHandler(categoryController.addCategory)
  )
  .get(errorHandler(categoryController.getCategorys));

router
  .route("/:id")
  .delete(
    authMiddleware.isAuthenticated,
    authMiddleware.restrictTo(Role.Admin),
    categoryController.deleteCategory
  )
  .patch(
    authMiddleware.isAuthenticated,
    authMiddleware.restrictTo(Role.Admin),
    errorHandler(categoryController.updateCategory)
  );

export default router;
