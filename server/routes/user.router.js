const express = require("express");
const router = express.Router();
const UserModel = require("../models/User.model");
const verifyToken = require("../middlewares/verifyToken");
const verifyAdmin = require("../middlewares/verifyAdmin");

router.get("/", async (req, res) => {
  try {
    const users = await UserModel.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const users = await UserModel.findById(userId);
    if (!users) {
      return res.status(404).json({ message: "user Not Found" });
    }
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  const user = req.body;
  try {
    const existingUser = await UserModel.findOne({
      email: user.email,
    });
    if (existingUser) {
      return res.status(302).json({ message: "User already exists" });
    }
    if (!req.body.photoURL) {
      user.photoURL =
        "https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg";
    }
    const newUser = new UserModel(user);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  try {
    const user = await UserModel.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const user = await UserModel.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// check isAdmin User
router.get("/admin/:email", verifyToken, async (req, res) => {
  try {
    const { email } = req.params;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    let isAdmin = false;
    if (user.role === "admin") {
      isAdmin = true;
    }
    res.json({ isAdmin });
  } catch (error) {
    console.error("Error checking admin status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//Change Admin to User Role
router.patch("/user/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      {
        role: "user",
      },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User Not Found" });
    }
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
//change User to Admin Role
router.patch("/admin/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      {
        role: "admin",
      },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User Not Found" });
    }
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
