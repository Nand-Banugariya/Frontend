const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/auth");

// Get user profile
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update user profile
router.put("/profile", auth, async (req, res) => {
  try {
    const { username, email, interests } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (username) user.username = username;
    if (email) user.email = email;
    if (interests) user.interests = interests;

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get user's upcoming events
router.get("/events", auth, async (req, res) => {
  try {
    // This is a placeholder. In a real app, you would fetch events from an events collection
    const events = [
      {
        id: "1",
        name: "Holi Festival Workshop",
        date: "March 15, 2024",
        location: "Mumbai",
        description: "Learn about the traditions and celebrations of Holi",
        category: "Festival",
      },
      {
        id: "2",
        name: "Classical Dance Performance",
        date: "April 10, 2024",
        location: "Delhi",
        description: "Experience the beauty of classical Indian dance",
        category: "Performance",
      },
    ];
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get user's recent activities
router.get("/activities", auth, async (req, res) => {
  try {
    // This is a placeholder. In a real app, you would fetch activities from an activities collection
    const activities = [
      {
        id: "1",
        type: "bookmark",
        item: "The Art of Madhubani",
        date: "3 days ago",
      },
      {
        id: "2",
        type: "comment",
        item: "Festival of Lights: Diwali",
        date: "1 week ago",
      },
      {
        id: "3",
        type: "share",
        item: "Classical Bharatanatyam",
        date: "2 weeks ago",
      },
    ];
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Add bookmark
router.post("/bookmarks", auth, async (req, res) => {
  try {
    const { itemId } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.bookmarks.includes(itemId)) {
      user.bookmarks.push(itemId);
      await user.save();
    }

    res.json({ message: "Bookmark added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Remove bookmark
router.delete("/bookmarks/:itemId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.bookmarks = user.bookmarks.filter((id) => id !== req.params.itemId);
    await user.save();

    res.json({ message: "Bookmark removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get user's bookmarks
router.get("/bookmarks", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.bookmarks);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
