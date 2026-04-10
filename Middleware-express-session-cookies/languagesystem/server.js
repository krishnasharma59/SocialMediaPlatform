const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// View engine
app.set("view engine", "ejs");


// 🔹 Language Data
const content = {
  en: {
    title: "Welcome",
    message: "Hello! This is your dashboard",
    button: "Change Language"
  },
  hi: {
    title: "स्वागत है",
    message: "नमस्ते! यह आपका डैशबोर्ड है",
    button: "भाषा बदलें"
  }
};


// 🔹 Home Route
app.get("/", (req, res) => {
  const lang = req.cookies.language || "en"; // default English
  res.render("home", { data: content[lang] });
});


// 🔹 Change Language
app.post("/change-language", (req, res) => {
  const { language } = req.body;

  res.cookie("language", language, {
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  });

  res.redirect("/");
});


// Start server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});