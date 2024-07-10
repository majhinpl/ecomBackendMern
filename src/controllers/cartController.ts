import { Request, Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import Cart from "../database/models/cartModel";
import Product from "../database/models/productModel";

class CartController {
  async addToCart(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user?.id;
    const { quantity, productId } = req.body;
    if (!quantity || !productId) {
      res.status(400).json({
        message: "Please provide quantity, productId",
      });
    }

    // check if the product already exits in the cart table or not
    let cartItem = await Cart.findOne({
      where: {
        productId,
        userId,
      },
    });

    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      // insert into cart table
      cartItem = await Cart.create({
        quantity,
        userId,
        productId,
      });
    }
    res.status(200).json({
      message: "Product added to cart",
      data: cartItem,
    });
  }

  async getMyCarts(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user?.id;
    const cartItem = await Cart.findAll({
      where: {
        userId,
      },
      include: [
        {
          model: Product,
        },
      ],
    });
    if (cartItem.length === 0) {
      res.status(404).json({
        message: "No items in the cart",
      });
    } else {
      res.status(200).json({
        message: "Cart items fetched successfully",
        data: cartItem,
      });
    }
  }
}

export default new CartController();
