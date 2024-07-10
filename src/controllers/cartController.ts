import { Request, Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import Cart from "../database/models/cartModel";
import Product from "../database/models/productModel";
import Category from "../database/models/categoryModel";

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
          attributes: ["productName", "productDescription", "productImageUrl"],
          include: [
            {
              model: Category,
              attributes: ["id", "categoryName"],
            },
          ],
        },
      ],
      attributes: ["productId", "quantity"],
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

  async deleteMyCartItem(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user?.id;
    const { productId } = req.params;
    // check whether above productId product exit or not
    const product = await Product.findByPk(productId);
    if (!product) {
      res.status(404).json({
        message: "No Product with that id",
      });
      return;
    }
    // delete that productId from userCart
    await Cart.destroy({
      where: {
        userId,
        productId,
      },
    });
    res.status(200).json({
      message: "product of cart deleted successfully",
    });
  }

  async updateCartItem(req: AuthRequest, res: Response): Promise<void> {
    const { productId } = req.params;
    const userId = req.user?.id;
    const { quantity } = req.body;
    if (!quantity) {
      res.status(400).json({
        message: "Please providequantity",
      });
      return;
    }
    const cartData = await Cart.findOne({
      where: {
        userId,
        productId,
      },
    });

    if (cartData) {
      cartData.quantity = quantity;
      await cartData?.save();
      res.status(200).json({
        message: "Product of cart updated successfully",
        data: cartData,
      });
    } else {
      res.status(404).json({
        message: "productId unavailable for that userId",
      });
    }
  }
}

export default new CartController();
