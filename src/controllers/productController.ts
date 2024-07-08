import { Request, Response } from "express";
import Product from "../database/models/productModel";
import { AuthRequest } from "../middleware/authMiddleware";
import User from "../database/models/userModel";
import Category from "../database/models/categoryModel";

class ProductController {
  async addProduct(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user?.id;
    const {
      productName,
      productDescription,
      productTotalStockQty,
      productPrice,
      categoryId,
    } = req.body;

    let fileName;

    if (req.file) {
      fileName = req.file?.filename;
    } else {
      fileName =
        "https://images.pexels.com/photos/20991840/pexels-photo-20991840/free-photo-of-a-woman-sitting-on-the-floor-in-front-of-a-cabinet.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";
    }

    if (
      !productName ||
      !productDescription ||
      !productTotalStockQty ||
      !productPrice
    ) {
      res.status(400).json({
        message: "please provide required field",
      });
      return;
    }

    await Product.create({
      productName,
      productDescription,
      productTotalStockQty,
      productPrice,
      productImageUrl: fileName,
      userId: userId,
      categoryId: categoryId,
    });
    res.status(200).json({
      message: "product added successfully",
    });
  }

  async getAllProduct(req: AuthRequest, res: Response): Promise<void> {
    const data = await Product.findAll({
      include: [
        {
          model: User,
          attributes: ["id", "email", "username"],
        },
        {
          model: Category,
          attributes: ["id", "categoryName"],
        },
      ],
    });
    res.status(200).json({
      message: "Products fetched successfully",
      data,
    });
  }
}

export default new ProductController();
