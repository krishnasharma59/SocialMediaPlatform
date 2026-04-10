const express = require("express");
const session = require("express-session");

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: "secret123",
  resave: false,
  saveUninitialized: true
}));

// View engine
app.set("view engine", "ejs");

const users = [
  { username: "admin", password: "123", role: "admin" },
  { username: "user", password: "123", role: "user" }
];


function isAuthenticated(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/");
  }
}


function isAdmin(req, res, next) {
  if (req.session.user && req.session.user.role === "admin") {
    next();
  } else {
    res.send("Access Denied ❌ (Admin only)");
  }
}


// 🔹 Routes

// Login Page
app.get("/", (req, res) => {
  res.render("login");
});

// Handle Login
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find(
    u => u.username === username && u.password === password
  );

  if (user) {
    req.session.user = user;
    res.redirect("/dashboard");
  } else {
    res.send("Invalid credentials ❌");
  }
});


// Dashboard (All logged-in users)
app.get("/dashboard", isAuthenticated, (req, res) => {
  res.render("dashboard", { user: req.session.user });
});


// Admin Panel (Only admin)
app.get("/admin", isAuthenticated, isAdmin, (req, res) => {
  res.render("admin", { user: req.session.user });
});


// Logout
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});


// Start server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});