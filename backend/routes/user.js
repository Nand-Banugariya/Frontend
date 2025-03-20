const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Event = require("../models/Event");
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
    console.error("Get profile error:", error);
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
    console.log("Fetching events for user:", req.user.id);
    const events = await Event.find().sort({ date: 1 });
    console.log("Found events:", events.length);
    res.json(events);
  } catch (error) {
    console.error("Fetch events error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create a new event
router.post("/events", auth, async (req, res) => {
  try {
    const { name, date, location, description, category } = req.body;

    const newEvent = new Event({
      name,
      date,
      location,
      description,
      category,
      createdBy: req.user.id,
    });

    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    console.error("Event creation error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get a specific event
router.get("/events/:id", auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update an event
router.put("/events/:id", auth, async (req, res) => {
  try {
    const { name, date, location, description, category } = req.body;
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if the user is the creator of the event
    if (event.createdBy.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ message: "Not authorized to update this event" });
    }

    if (name) event.name = name;
    if (date) event.date = date;
    if (location) event.location = location;
    if (description) event.description = description;
    if (category) event.category = category;

    const updatedEvent = await event.save();
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete an event
router.delete("/events/:id", auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if the user is the creator of the event
    if (event.createdBy.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ message: "Not authorized to delete this event" });
    }

    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Event deleted successfully" });
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
