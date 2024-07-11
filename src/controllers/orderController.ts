import { Request, Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { KhaltiResponse, OderData, PaymentMethod } from "../types/orderTypes";
import Order from "../database/models/orderModel";
import Payment from "../database/models/paymentModel";
import OrderDetail from "../database/models/orderDetails";
import axios from "axios";

class OrderController {
  async createOrder(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user?.id;
    const {
      phoneNumber,
      shippingAddress,
      totalAmount,
      paymentDetails,
      items,
    }: OderData = req.body;

    if (
      !phoneNumber ||
      !shippingAddress ||
      !totalAmount ||
      !paymentDetails ||
      !paymentDetails.paymentMethod ||
      items.length === 0
    ) {
      res.status(400).json({
        message: "Please provide required field",
      });
    }

    const paymentData = await Payment.create({
      paymentMethod: paymentDetails.paymentMethod,
    });

    const orderData = await Order.create({
      phoneNumber,
      shippingAddress,
      totalAmount,
      userId,
      paymentId: paymentData.id,
    });

    for (let i = 0; i < items.length; i++) {
      await OrderDetail.create({
        quantity: items[i].quantity,
        productId: items[0].productId,
        orderId: orderData.id,
      });
    }

    if (paymentDetails.paymentMethod === PaymentMethod.Khalti) {
      // Khalti integration
      const data = {
        return_url: "http://localhost:5000/success",
        purchase_order_id: orderData.id,
        amount: totalAmount * 100,
        website_url: "http://localhost:5000",
        purchase_order_name: "orderName_" + orderData.id,
      };

      const response = await axios.post(
        "https://a.khalti.com/api/v2/epayment/initiate/",
        data,
        {
          headers: {
            Authorization: "key 23d2e21e00774c49974a641a7c077ec4",
          },
        }
      );
      const khaltiResponse: KhaltiResponse = response.data;
      paymentData.pidx = khaltiResponse.pidx;
      paymentData.save();
      res.status(200).json({
        message: "order placed successfully",
        url: khaltiResponse.payment_url,
      });
    } else {
      res.status(200).json({
        message: "Order place successfully",
      });
    }
  }
}

export default new OrderController();
