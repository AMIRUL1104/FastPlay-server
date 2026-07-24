import type { Filter } from "mongodb";
import type { Product, ProductSearchFilters } from "../types/product.types.js";
import { productsCollection } from "../database/collections.js";

export const searchProducts = async (
  filters: ProductSearchFilters,
): Promise<Product[]> => {
  const query: Filter<Product> = {};

  if (filters.search) {
    query.$or = [
      {
        name: {
          $regex: filters.search,
          $options: "i",
        },
      },
      {
        description: {
          $regex: filters.search,
          $options: "i",
        },
      },
      {
        brand: {
          $regex: filters.search,
          $options: "i",
        },
      },
    ];
  }

  if (filters.category) {
    query.category = filters.category as Product["category"];
  }

  if (filters.brand) {
    query.brand = filters.brand;
  }

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    query.price = {};

    if (filters.minPrice !== undefined) {
      query.price.$gte = filters.minPrice;
    }

    if (filters.maxPrice !== undefined) {
      query.price.$lte = filters.maxPrice;
    }
  }

  if (filters.inStock) {
    query.stock = {
      $gt: 0,
    };
  }

  if (filters.featured !== undefined) {
    query.featured = filters.featured;
  }

  return productsCollection
    .find(query)
    .limit(filters.limit ?? 10)
    .toArray();
};
