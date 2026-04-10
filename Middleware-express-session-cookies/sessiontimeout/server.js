const express = require("express");
const session = require("express-session");

const app = express();

app.use(express.urlencoded({ extended: true }));

// 🔐 Session setup
app.use(session({
  secret: "secret123",
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 60 * 1000 // 1 minute
  }
}));

app.set("view engine", "ejs");


// 🔹 Home Route
app.get("/", (req, res) => {
  if (!req.session.user) {
    req.session.user = "Kaustubhi"; // auto login for demo
  }

  res.render("home");
});


// 🔹 Extend Session
app.get("/extend-session", (req, res) => {
  req.session.touch(); // refresh session
  res.send("Session Extended ✅");
});


// Start server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});