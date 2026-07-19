import { ObjectId } from "mongodb";
import type { Product } from "../types/product.types.js";
import type { Request, Response } from "express";
import type { Filter, Sort } from "mongodb";
import { productsCollection } from "../database/collections.js";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;

const SORT_OPTIONS: Record<string, Sort> = {
  newest: { createdAt: -1 },
  oldest: { createdAt: 1 },
  "price-asc": { price: 1 },
  "price-desc": { price: -1 },
  "name-asc": { name: 1 },
  "name-desc": { name: -1 },
};

const getQueryValue = (value: unknown): string | undefined =>
  typeof value === "string" ? value.trim() : undefined;

const getPositiveInteger = (
  value: unknown,
  defaultValue: number,
  maximum?: number,
): number => {
  const parsedValue = Number(getQueryValue(value));

  if (!Number.isInteger(parsedValue) || parsedValue < 1) {
    return defaultValue;
  }

  return maximum ? Math.min(parsedValue, maximum) : parsedValue;
};

const escapeRegex = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Create Product
export const createProduct = async (req: Request, res: Response) => {
  try {
    const productData = {
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await productsCollection.insertOne(productData);

    res.status(201).json({
      success: true,
      message: "Product created successfully.",
      insertedId: result.insertedId,
    });
  } catch (error) {
    console.error("Failed to create product:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create product.",
    });
  }
};

// Browse Products
export const getAllProducts = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const page = getPositiveInteger(req.query.page, DEFAULT_PAGE);
    const limit = getPositiveInteger(req.query.limit, DEFAULT_LIMIT, MAX_LIMIT);

    const search = getQueryValue(req.query.search);
    const category = getQueryValue(req.query.category);
    const sort = getQueryValue(req.query.sort) ?? "newest";

    const minPrice = Number(getQueryValue(req.query.minPrice));
    const maxPrice = Number(getQueryValue(req.query.maxPrice));

    const query: Filter<Product> = {};

    if (search) {
      const pattern = escapeRegex(search);

      query.$or = [
        { name: { $regex: pattern, $options: "i" } },
        { brand: { $regex: pattern, $options: "i" } },
        { category: { $regex: pattern, $options: "i" } },
      ];
    }

    if (category) {
      query.category = category as Product["category"];
    }

    if (!isNaN(minPrice) || !isNaN(maxPrice)) {
      query.price = {};

      if (!isNaN(minPrice)) query.price.$gte = minPrice;
      if (!isNaN(maxPrice)) query.price.$lte = maxPrice;
    }

    const sortQuery = SORT_OPTIONS[sort] ?? { createdAt: -1 };

    const [products, total] = await Promise.all([
      productsCollection
        .find(query)
        .sort(sortQuery)
        .skip((page - 1) * limit)
        .limit(limit)
        .toArray(),

      productsCollection.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: products,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
      currentPage: page,
    });
  } catch (error) {
    console.error("GET /api/products:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch products.",
    });
  }
};

// Get Single Product
export const getProductById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product id.",
      });
    }

    const product = await productsCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch product.",
    });
  }
};

// Get Featured Products
export const getFeaturedProducts = async (req: Request, res: Response) => {
  try {
    const products = await productsCollection
      .find({ featured: true })
      .sort({ createdAt: -1 })
      .limit(8)
      .toArray();

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("Failed to fetch featured products:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch featured products.",
    });
  }
};

// Update Product
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product id.",
      });
    }

    const result = await productsCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...req.body,
          updatedAt: new Date(),
        },
      },
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to update product.",
    });
  }
};

// Delete Product
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product id.",
      });
    }

    const result = await productsCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to delete product.",
    });
  }
};

// Get All Products For Admin
export const getAllProductsForAdmin = async (req: Request, res: Response) => {
  try {
    const products = await productsCollection
      .find()
      .sort({ createdAt: -1 })
      .toArray();

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("Failed to fetch products:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch products.",
    });
  }
};
