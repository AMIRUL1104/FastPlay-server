import type { Response } from "express";
import { ObjectId } from "mongodb";

import type { AuthRequest } from "../types/auth.types.js";
import { cartCollection, orderCollection } from "../database/collections.js";
import type { Order } from "../types/order.types.js";

// Get Logged-in User Orders
export const getMyOrders = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const user = req.user;

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
      return;
    }

    const orders = await orderCollection
      .find({
        "user.userId": new ObjectId(user._id),
      })
      .sort({ createdAt: -1 })
      .toArray();

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("Failed to fetch orders:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch orders.",
    });
  }
};

// Get All Orders (Admin)
export const getAllOrders = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const orders = await orderCollection
      .find()
      .sort({ createdAt: -1 })
      .toArray();

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("Failed to fetch orders:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch orders.",
    });
  }
};

// Get Single Order
export const getOrderById = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const id = req.params.id as string;

    if (!ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid order id.",
      });
      return;
    }

    const order = await orderCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!order) {
      res.status(404).json({
        success: false,
        message: "Order not found.",
      });
      return;
    }

    const user = req.user!;

    // Admin can access every order
    if (user.role !== "admin") {
      if (!order.user.userId.equals(new ObjectId(user._id))) {
        res.status(403).json({
          success: false,
          message: "Forbidden.",
        });
        return;
      }
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Failed to fetch order:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch order.",
    });
  }
};

// Create Order
export const createOrder = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const user = req.user;
    console.log(user);

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
      return;
    }

    const shippingAddress = req.body.shippingAddress;
    console.log(shippingAddress);

    const cart = await cartCollection.findOne({
      "user.userId": new ObjectId(user._id),
    });

    if (!cart || cart.items.length === 0) {
      res.status(400).json({
        success: false,
        message: "Cart is empty.",
      });
      return;
    }

    const order: Order = {
      user: {
        userId: cart.user.userId,
        name: cart.user.name,
        email: cart.user.email,
        phone: shippingAddress.phone,
      },

      shippingAddress,

      products: cart.items,

      totalPrice: cart.totalPrice,

      paymentMethod: "Cash On Delivery",

      status: "pending",

      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await orderCollection.insertOne(order);

    await cartCollection.updateOne(
      { _id: cart._id },
      {
        $set: {
          items: [],
          totalItems: 0,
          totalPrice: 0,
          updatedAt: new Date(),
        },
      },
    );

    res.status(201).json({
      success: true,
      message: "Order placed successfully.",
      insertedId: result.insertedId,
    });
  } catch (error) {
    console.error("Failed to create order:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create order.",
    });
  }
};

// Accept Order
export const acceptOrder = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const id = req.params.id as string;

    if (!ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid order id.",
      });
      return;
    }

    const order = await orderCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!order) {
      res.status(404).json({
        success: false,
        message: "Order not found.",
      });
      return;
    }

    if (order.status !== "pending") {
      res.status(400).json({
        success: false,
        message: "Only pending orders can be accepted.",
      });
      return;
    }

    await orderCollection.updateOne(
      { _id: order._id },
      {
        $set: {
          status: "accepted",
          updatedAt: new Date(),
        },
      },
    );

    res.status(200).json({
      success: true,
      message: "Order accepted successfully.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to accept order.",
    });
  }
};

// Reject Order
export const rejectOrder = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const id = req.params.id as string;

    if (!ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid order id.",
      });
      return;
    }

    const order = await orderCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!order) {
      res.status(404).json({
        success: false,
        message: "Order not found.",
      });
      return;
    }

    if (order.status !== "pending") {
      res.status(400).json({
        success: false,
        message: "Only pending orders can be rejected.",
      });
      return;
    }

    await orderCollection.updateOne(
      { _id: order._id },
      {
        $set: {
          status: "rejected",
          updatedAt: new Date(),
        },
      },
    );

    res.status(200).json({
      success: true,
      message: "Order rejected successfully.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to reject order.",
    });
  }
};

// Cancel Order
export const cancelOrder = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const user = req.user!;
    const id = req.params.id as string;

    if (!ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid order id.",
      });
      return;
    }

    const order = await orderCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!order) {
      res.status(404).json({
        success: false,
        message: "Order not found.",
      });
      return;
    }

    // User can cancel only own order
    if (
      user.role !== "admin" &&
      !order.user.userId.equals(new ObjectId(user._id))
    ) {
      res.status(403).json({
        success: false,
        message: "Forbidden.",
      });
      return;
    }

    if (order.status !== "pending" && order.status !== "accepted") {
      res.status(400).json({
        success: false,
        message: "This order cannot be cancelled.",
      });
      return;
    }

    await orderCollection.updateOne(
      { _id: order._id },
      {
        $set: {
          status: "cancelled",
          updatedAt: new Date(),
        },
      },
    );

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to cancel order.",
    });
  }
};
