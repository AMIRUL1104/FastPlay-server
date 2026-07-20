import type { Request, Response } from "express";
import { ObjectId } from "mongodb";
import type { AuthRequest } from "../types/auth.types.js";
import type { Cart, CartItem } from "../types/cart.types.js";
import { cartCollection, productsCollection } from "../database/collections.js";

// Get User Cart
export const getCart = async (
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

    const cart = await cartCollection.findOne({
      "user.userId": new ObjectId(user._id),
    });

    if (!cart) {
      res.status(200).json({
        success: true,
        data: {
          items: [],
          totalItems: 0,
          totalPrice: 0,
        },
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    console.error("Failed to fetch cart:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch cart.",
    });
  }
};

// Add To Cart
export const addToCart = async (
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

    const { productId, quantity } = req.body;

    if (!ObjectId.isValid(productId)) {
      res.status(400).json({
        success: false,
        message: "Invalid product id.",
      });
      return;
    }

    const product = await productsCollection.findOne({
      _id: new ObjectId(productId),
    });

    if (!product) {
      res.status(404).json({
        success: false,
        message: "Product not found.",
      });
      return;
    }

    let cart = await cartCollection.findOne({
      "user.userId": new ObjectId(user._id),
    });

    const cartItem: CartItem = {
      productId: product._id!,
      name: product.name,
      brand: product.brand,
      category: product.category,
      image: product.image,
      price: product.price,
      quantity,
      subtotal: product.price * quantity,
    };

    if (!cart) {
      const newCart: Cart = {
        user: {
          userId: new ObjectId(user._id),
          name: user.name,
          email: user.email,
        },
        items: [cartItem],
        totalItems: quantity,
        totalPrice: cartItem.subtotal,
        updatedAt: new Date(),
      };

      await cartCollection.insertOne(newCart);

      res.status(201).json({
        success: true,
        message: "Product added to cart.",
      });
      return;
    }

    const existingItem = cart.items.find((item) =>
      item.productId.equals(new ObjectId(productId)),
    );

    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.subtotal = existingItem.price * existingItem.quantity;
    } else {
      cart.items.push(cartItem);
    }

    cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);

    cart.totalPrice = cart.items.reduce((sum, item) => sum + item.subtotal, 0);

    cart.updatedAt = new Date();

    await cartCollection.updateOne(
      { _id: cart._id },
      {
        $set: {
          items: cart.items,
          totalItems: cart.totalItems,
          totalPrice: cart.totalPrice,
          updatedAt: cart.updatedAt,
        },
      },
    );

    res.status(200).json({
      success: true,
      message: "Cart updated successfully.",
    });
  } catch (error) {
    console.error("Failed to add to cart:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add product to cart.",
    });
  }
};

// Update Cart Item Quantity
export const updateCartItem = async (
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

    const productId = req.params.productId as string;
    const { quantity } = req.body;

    if (!ObjectId.isValid(productId)) {
      res.status(400).json({
        success: false,
        message: "Invalid product id.",
      });
      return;
    }

    if (!quantity || quantity < 1) {
      res.status(400).json({
        success: false,
        message: "Invalid quantity.",
      });
      return;
    }

    const cart = await cartCollection.findOne({
      "user.userId": new ObjectId(user._id),
    });

    if (!cart) {
      res.status(404).json({
        success: false,
        message: "Cart not found.",
      });
      return;
    }

    const item = cart.items.find((item) =>
      item.productId.equals(new ObjectId(productId)),
    );

    if (!item) {
      res.status(404).json({
        success: false,
        message: "Product not found in cart.",
      });
      return;
    }

    item.quantity = quantity;
    item.subtotal = item.price * quantity;

    cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);

    cart.totalPrice = cart.items.reduce((sum, item) => sum + item.subtotal, 0);

    cart.updatedAt = new Date();

    await cartCollection.updateOne(
      { _id: cart._id },
      {
        $set: {
          items: cart.items,
          totalItems: cart.totalItems,
          totalPrice: cart.totalPrice,
          updatedAt: cart.updatedAt,
        },
      },
    );

    res.status(200).json({
      success: true,
      message: "Cart updated successfully.",
    });
  } catch (error) {
    console.error("Failed to update cart:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update cart.",
    });
  }
};

// Remove Cart Item
export const removeCartItem = async (
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

    const productId = req.params.productId as string;

    if (!ObjectId.isValid(productId)) {
      res.status(400).json({
        success: false,
        message: "Invalid product id.",
      });
      return;
    }

    const cart = await cartCollection.findOne({
      "user.userId": new ObjectId(user._id),
    });

    if (!cart) {
      res.status(404).json({
        success: false,
        message: "Cart not found.",
      });
      return;
    }

    const filteredItems = cart.items.filter(
      (item) => !item.productId.equals(new ObjectId(productId)),
    );

    if (filteredItems.length === cart.items.length) {
      res.status(404).json({
        success: false,
        message: "Product not found in cart.",
      });
      return;
    }

    const totalItems = filteredItems.reduce(
      (sum, item) => sum + item.quantity,
      0,
    );

    const totalPrice = filteredItems.reduce(
      (sum, item) => sum + item.subtotal,
      0,
    );

    await cartCollection.updateOne(
      { _id: cart._id },
      {
        $set: {
          items: filteredItems,
          totalItems,
          totalPrice,
          updatedAt: new Date(),
        },
      },
    );

    res.status(200).json({
      success: true,
      message: "Product removed from cart.",
    });
  } catch (error) {
    console.error("Failed to remove cart item:", error);

    res.status(500).json({
      success: false,
      message: "Failed to remove product from cart.",
    });
  }
};

// Clear Cart
export const clearCart = async (
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

    const result = await cartCollection.updateOne(
      {
        "user.userId": new ObjectId(user._id),
      },
      {
        $set: {
          items: [],
          totalItems: 0,
          totalPrice: 0,
          updatedAt: new Date(),
        },
      },
    );

    if (result.matchedCount === 0) {
      res.status(404).json({
        success: false,
        message: "Cart not found.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully.",
    });
  } catch (error) {
    console.error("Failed to clear cart:", error);

    res.status(500).json({
      success: false,
      message: "Failed to clear cart.",
    });
  }
};
