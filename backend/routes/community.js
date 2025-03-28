const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");
const auth = require("../middleware/auth");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/posts";
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, "post-" + uniqueSuffix + ext);
  },
});

// Filter files to accept only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// GET all posts (with optional filter)
router.get("/posts", async (req, res) => {
  try {
    const { type } = req.query;

    // Build query
    let query = {};
    if (type && ["story", "blog", "photo", "event"].includes(type)) {
      query.contentType = type;
    }

    // Get posts with pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments(query);

    res.json({
      posts,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET featured posts
router.get("/posts/featured", async (req, res) => {
  try {
    const featuredPosts = await Post.find({ featured: true })
      .sort({ createdAt: -1 })
      .limit(5);

    res.json(featuredPosts);
  } catch (error) {
    console.error("Error fetching featured posts:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET upcoming events
router.get("/posts/events", async (req, res) => {
  try {
    const now = new Date();

    const upcomingEvents = await Post.find({
      contentType: "event",
      eventDate: { $gt: now },
    })
      .sort({ eventDate: 1 })
      .limit(5);

    res.json(upcomingEvents);
  } catch (error) {
    console.error("Error fetching upcoming events:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET single post by ID
router.get("/posts/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST create new post (requires authentication)
router.post("/posts", auth, upload.array("images", 3), async (req, res) => {
  try {
    const { title, content, contentType, location, eventDate } = req.body;

    // Get user info from authentication
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Process uploaded images if any
    const imageUrls = req.files
      ? req.files.map((file) => `/${file.path.replace(/\\/g, "/")}`)
      : [];

    // Create new post
    const newPost = new Post({
      title,
      content,
      contentType,
      author: {
        id: user._id,
        name: user.username,
        avatar: user.avatar,
      },
      images: imageUrls.length > 0 ? imageUrls : undefined,
      location: location || undefined,
      eventDate: eventDate || undefined,
    });

    const savedPost = await newPost.save();

    // Add post to user's posts
    user.posts = user.posts || [];
    user.posts.push({
      id: savedPost._id,
      title: savedPost.title,
      contentType: savedPost.contentType,
      createdAt: savedPost.createdAt,
    });
    await user.save();

    res.status(201).json(savedPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT update post (requires authentication)
router.put("/posts/:id", auth, upload.array("images", 3), async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if user is the author
    if (post.author.id.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this post" });
    }

    // Update post fields
    const { title, content, contentType, location, eventDate } = req.body;

    if (title) post.title = title;
    if (content) post.content = content;
    if (contentType) post.contentType = contentType;
    if (location !== undefined) post.location = location || undefined;
    if (eventDate !== undefined) post.eventDate = eventDate || undefined;

    // Process new images if any
    if (req.files && req.files.length > 0) {
      const imageUrls = req.files.map(
        (file) => `/${file.path.replace(/\\/g, "/")}`
      );
      post.images = [...(post.images || []), ...imageUrls];
    }

    const updatedPost = await post.save();

    // Update the title in user's posts array
    const user = await User.findById(req.user.id);
    if (user && user.posts) {
      const postIndex = user.posts.findIndex(
        (p) => p.id.toString() === post._id.toString()
      );
      if (postIndex !== -1) {
        user.posts[postIndex].title = post.title;
        user.posts[postIndex].contentType = post.contentType;
        await user.save();
      }
    }

    res.json(updatedPost);
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE delete post (requires authentication)
router.delete("/posts/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if user is the author
    if (post.author.id.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this post" });
    }

    // Delete the post
    await Post.findByIdAndDelete(req.params.id);

    // Remove post from user's posts array
    const user = await User.findById(req.user.id);
    if (user) {
      user.posts = user.posts.filter((p) => p.id.toString() !== req.params.id);
      await user.save();
    }

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST toggle like on post (requires authentication)
router.post("/posts/:id/like", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if user already liked post
    const alreadyLiked = post.likedBy.includes(req.user.id);

    if (alreadyLiked) {
      // Remove like
      post.likes = Math.max(0, post.likes - 1);
      post.likedBy = post.likedBy.filter((id) => id.toString() !== req.user.id);
    } else {
      // Add like
      post.likes += 1;
      post.likedBy.push(req.user.id);
    }

    await post.save();

    res.json({
      likes: post.likes,
      liked: !alreadyLiked,
    });
  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
