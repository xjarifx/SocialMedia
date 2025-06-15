import User from "../models/user.model.js";

// Google Sign-In (or registration fallback)
export const googleAuth = async (req, res) => {
  const { name, email, profilePic, googleId } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({ name, email, profilePic, googleId });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Google Auth failed", error: err.message });
  }
};

// Search users by name
export const searchUsersByName = async (req, res) => {
  const query = req.query.q;
  if (!query)
    return res.status(400).json({ message: "Search query is required" });

  try {
    const users = await User.find({
      name: { $regex: query, $options: "i" },
    }).select("name email profilePic");

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Search failed", error: err.message });
  }
};
