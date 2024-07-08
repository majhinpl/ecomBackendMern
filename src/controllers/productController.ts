import { Request, Response } from "express";
import Product from "../database/models/productModel";

class ProductController {
  async addProduct(req: Request, res: Response): Promise<void> {
    const {
      productName,
      productDescription,
      productTotalStockQty,
      productPrice,
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
    });
    res.status(200).json({
      message: "product added successfully",
    });
  }
}

export default new ProductController();
