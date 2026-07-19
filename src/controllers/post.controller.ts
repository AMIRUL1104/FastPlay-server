// import type { Request, Response } from "express";
// import { ObjectId } from "mongodb";
// import type { Filter, Sort } from "mongodb";

// import type { AuthRequest } from "../types/auth.types.js";

// const DEFAULT_PAGE = 1;
// const DEFAULT_LIMIT = 20;
// const MAX_LIMIT = 50;

// const SORT_OPTIONS: Record<string, Sort> = {
//   newest: { publishedAt: -1 },
//   oldest: { publishedAt: 1 },
//   "title-asc": { "books.bookName": 1 },
//   "title-desc": { "books.bookName": -1 },
// };

// const getQueryValue = (value: unknown): string | undefined =>
//   typeof value === "string" ? value.trim() : undefined;

// const getPositiveInteger = (
//   value: unknown,
//   defaultValue: number,
//   maximum?: number,
// ): number => {
//   const parsedValue = Number(getQueryValue(value));

//   if (!Number.isInteger(parsedValue) || parsedValue < 1) {
//     return defaultValue;
//   }

//   return maximum ? Math.min(parsedValue, maximum) : parsedValue;
// };

// const escapeRegex = (value: string): string =>
//   value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// // Create Post
// export const createPost = async (req: Request, res: Response) => {
//   try {
//     const postData = {
//       ...req.body,
//       publishedAt: new Date(),
//     };

//     const result = await postsCollection.insertOne(postData);

//     res.status(201).json({
//       success: true,
//       message: "Post created successfully.",
//       insertedId: result.insertedId,
//       publishedAt: postData.publishedAt,
//     });
//   } catch (error) {
//     console.error("Failed to create post:", error);

//     res.status(500).json({
//       success: false,
//       message: "Failed to create post.",
//     });
//   }
// };
// // Browse posts with search, filters, sorting, and pagination.
// export const getAllPosts = async (
//   req: Request,
//   res: Response,
// ): Promise<void> => {
//   try {
//     const page = getPositiveInteger(req.query.page, DEFAULT_PAGE);
//     const limit = getPositiveInteger(req.query.limit, DEFAULT_LIMIT, MAX_LIMIT);
//     const search = getQueryValue(req.query.search);
//     const category = getQueryValue(req.query.category);
//     const condition = getQueryValue(req.query.condition);
//     const listingType = getQueryValue(req.query.listingType);
//     const sort = getQueryValue(req.query.sort) ?? "newest";

//     const query: Filter<Post> = {
//       status: "available",
//       isDeleted: { $ne: true },
//     };

//     if (search) {
//       const searchPattern = escapeRegex(search);

//       query.$or = [
//         { description: { $regex: searchPattern, $options: "i" } },
//         { category: { $regex: searchPattern, $options: "i" } },
//         { "books.bookName": { $regex: searchPattern, $options: "i" } },
//         { "books.publisherName": { $regex: searchPattern, $options: "i" } },
//       ];
//     }

//     if (category) {
//       query.category = {
//         $regex: `^${escapeRegex(category)}$`,
//         $options: "i",
//       };
//     }

//     if (condition) {
//       query["books.condition"] = condition;
//     }

//     if (listingType === "sell" || listingType === "donate") {
//       query.type = listingType;
//     }

//     const sortQuery: Sort = SORT_OPTIONS[sort] ?? { publishedAt: -1 };
//     const [books, total] = await Promise.all([
//       postsCollection
//         .find(query)
//         .sort(sortQuery)
//         .skip((page - 1) * limit)
//         .limit(limit)
//         .toArray(),
//       postsCollection.countDocuments(query),
//     ]);

//     res.status(200).json({
//       success: true,
//       books,
//       total,
//       totalPages: Math.max(1, Math.ceil(total / limit)),
//       currentPage: page,
//     });
//   } catch (error) {
//     console.error("GET /api/posts:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch posts.",
//     });
//   }
// };

// // Get My Posts . this api serve a seller all posts

// export const getMyPosts = async (req: AuthRequest, res: Response) => {
//   try {
//     const sellerId = req.user!._id;

//     const posts = await postsCollection
//       .find({
//         sellerId,
//         isDeleted: false,
//       })
//       .sort({
//         publishedAt: -1,
//       })
//       .toArray();

//     return res.status(200).json({
//       success: true,
//       books: posts,
//     });
//   } catch (error) {
//     console.error(error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch your posts.",
//     });
//   }
// };

// // Get Single Post
// export const getPostById = async (req: Request, res: Response) => {
//   try {
//     const id = req.params.id as string;

//     if (!ObjectId.isValid(id)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid post id.",
//       });
//     }

//     const post = await postsCollection.findOne({
//       _id: new ObjectId(id),
//       isDeleted: { $ne: true },
//     });

//     if (!post) {
//       return res.status(404).json({
//         success: false,
//         message: "Post not found.",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: post,
//     });
//   } catch (error) {
//     console.error(error);

//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch post.",
//     });
//   }
// };

// export const getFeaturedPosts = async (req: Request, res: Response) => {
//   try {
//     const posts = await postsCollection
//       .find({
//         isDeleted: { $ne: true },
//         status: "available",
//       })
//       .sort({ createdAt: -1 })
//       .limit(8)
//       .toArray();

//     res.status(200).json({
//       success: true,
//       data: posts,
//     });
//   } catch (error) {
//     console.error("Failed to fetch featured posts:", error);

//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch featured posts.",
//     });
//   }
// };

// // Update Post
// export const updatePost = async (req: Request, res: Response) => {
//   try {
//     const id = req.params.id as string;

//     if (!ObjectId.isValid(id)) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Invalid post id." });
//     }

//     const result = await postsCollection.updateOne(
//       { _id: new ObjectId(id), isDeleted: { $ne: true } },
//       { $set: { ...req.body, updatedAt: new Date() } },
//     );

//     if (result.matchedCount === 0) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Post not found." });
//     }

//     res
//       .status(200)
//       .json({ success: true, message: "Post updated successfully." });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Failed to update post." });
//   }
// };

// // Delete Post (Soft Delete)
// export const deletePost = async (req: Request, res: Response) => {
//   try {
//     const id = req.params.id as string;

//     if (!ObjectId.isValid(id)) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Invalid post id." });
//     }

//     const result = await postsCollection.updateOne(
//       { _id: new ObjectId(id), isDeleted: { $ne: true } },
//       { $set: { isDeleted: true, updatedAt: new Date() } },
//     );

//     if (result.matchedCount === 0) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Post not found." });
//     }

//     res
//       .status(200)
//       .json({ success: true, message: "Post deleted successfully." });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Failed to delete post." });
//   }
// };

// export const getAllPostsForAdmin = async (req: Request, res: Response) => {
//   try {
//     const result = await postsCollection.find().toArray();
//     res.status(200).json({
//       success: true,
//       data: result,
//     });
//   } catch (error) {
//     console.error("Failed to fetch posts:", error);

//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch posts.",
//     });
//   }
// };
