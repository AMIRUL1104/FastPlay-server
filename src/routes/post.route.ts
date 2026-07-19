// import { Router } from "express";

// import {
//   createPost,
//   getAllPosts,
//   getPostById,
//   getMyPosts,
//   updatePost,
//   deletePost,
//   getFeaturedPosts,
//   getAllPostsForAdmin,
// } from "../controllers/post.controller.js";
// import { verifyToken } from "../middleware/auth.middleware.js";
// import { verifyAdmin, verifyUser } from "../middleware/role.middleware.js";
// const router = Router();

// // Create Post
// router.post("/", verifyToken, verifyUser, createPost);

// // Browse Posts
// router.get("/", getAllPosts);

// // My Posts
// router.get("/my", verifyToken, verifyUser, getMyPosts);

// // Get Featured Posts
// router.get("/featured", getFeaturedPosts);

// // posts for admin
// router.get("/admin", verifyToken, verifyAdmin, getAllPostsForAdmin);

// // Single Post
// router.get("/:id", getPostById);

// // Update Post
// router.patch("/:id", verifyToken, verifyUser, updatePost);

// // Delete Post
// router.delete("/:id", verifyToken, deletePost);

// export default router;
