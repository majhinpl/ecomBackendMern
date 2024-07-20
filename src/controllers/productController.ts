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
      !productPrice ||
      !categoryId
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
      productImageUrl: "http://localhost:5000/" + fileName,
      userId: userId,
      categoryId: categoryId,
    });
    res.status(200).json({
      message: "product added successfully",
    });
  }

  async getAllProduct(req: Request, res: Response): Promise<void> {
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

  async getSingleProduct(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    const data = await Product.findOne({
      where: {
        id: id,
      },
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

    if (!data) {
      res.status(404).json({
        message: "No product with that Id",
      });
    } else {
      res.status(200).json({
        message: "Product fetched successfully",
        data,
      });
    }
  }

  async deleteProduct(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    const data = await Product.findAll({
      where: {
        id: id,
      },
    });

    if (data.length > 0) {
      await Product.destroy({
        where: {
          id: id,
        },
      });
      res.status(200).json({
        message: "Product deleted successfully",
      });
    } else {
      res.status(400).json({
        message: "No product with that id",
      });
    }
  }
}

export default new ProductController();
