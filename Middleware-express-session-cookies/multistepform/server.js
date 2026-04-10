const express = require("express");
const session = require("express-session");

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));

// Session setup
app.use(session({
  secret: "mysecretkey",
  resave: false,
  saveUninitialized: true
}));

// View engine
app.set("view engine", "ejs");


// 🔹 Step 1
app.get("/", (req, res) => {
  res.render("step1");
});

app.post("/step1", (req, res) => {
  req.session.name = req.body.name;
  res.redirect("/step2");
});


// 🔹 Step 2
app.get("/step2", (req, res) => {
  res.render("step2");
});

app.post("/step2", (req, res) => {
  req.session.email = req.body.email;
  res.redirect("/step3");
});


// 🔹 Step 3
app.get("/step3", (req, res) => {
  res.render("step3");
});

app.post("/step3", (req, res) => {
  req.session.password = req.body.password;

  // Final Data
  const userData = {
    name: req.session.name,
    email: req.session.email,
    password: req.session.password
  };

  res.render("success", { user: userData });
});


// Start server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});