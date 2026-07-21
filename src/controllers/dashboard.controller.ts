import type { Request, Response } from "express";
import {
  orderCollection,
  productsCollection,
  userCollection,
} from "../database/collections.js";

// GET /api/dashboard/admin
export const getAdminDashboard = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const [
      totalProducts,
      totalOrders,
      pendingOrders,
      acceptedOrders,
      rejectedOrders,
      cancelledOrders,
      totalUsers,
    ] = await Promise.all([
      productsCollection.countDocuments(),

      orderCollection.countDocuments(),

      orderCollection.countDocuments({
        status: "pending",
      }),

      orderCollection.countDocuments({
        status: "accepted",
      }),

      orderCollection.countDocuments({
        status: "rejected",
      }),

      orderCollection.countDocuments({
        status: "cancelled",
      }),

      userCollection.countDocuments({
        role: "user",
      }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalProducts,
        totalOrders,
        pendingOrders,
        acceptedOrders,
        rejectedOrders,
        cancelledOrders,
        totalUsers,
      },
    });
  } catch (error) {
    console.error("Failed to fetch admin dashboard:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard data.",
    });
  }
};
