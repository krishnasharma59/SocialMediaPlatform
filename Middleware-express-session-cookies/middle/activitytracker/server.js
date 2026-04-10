const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User");

const app = express();
app.use(express.json());


// 🔹 Connect MongoDB (LOCAL)
mongoose.connect("mongodb://127.0.0.1:27017/userTracker", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));


// 🔹 LOGIN API
app.post("/login", async (req, res) => {
  try {
    const { name, email } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ name, email });
    }

    await user.save(); // triggers pre("save")

    res.json({
      message: "User logged in",
      user
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 🔹 UPDATE ACTIVITY
app.put("/activity/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {},
      { new: true }
    ); // triggers pre("findOneAndUpdate")

    res.json(user);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 🔹 LOGOUT API
app.post("/logout/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    await user.logout();

    res.json({
      message: "User logged out",
      user
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 🔹 Start Server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});