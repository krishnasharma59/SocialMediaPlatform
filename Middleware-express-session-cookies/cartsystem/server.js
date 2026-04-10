const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Session
app.use(session({
  secret: "secret123",
  resave: false,
  saveUninitialized: true
}));

app.set("view engine", "ejs");


// 🔹 Dummy Products
const products = [
  { id: 1, name: "Phone" },
  { id: 2, name: "Laptop" },
  { id: 3, name: "Headphones" }
];


// 🔹 HOME PAGE
app.get("/", (req, res) => {
  res.render("home", { products });
});


// 🔹 ADD TO CART
app.get("/add/:id", (req, res) => {
  const productId = parseInt(req.params.id);

  if (req.session.user) {
    // Logged-in → session cart
    if (!req.session.cart) req.session.cart = [];
    req.session.cart.push(productId);

  } else {
    // Anonymous → cookie cart
    let cart = req.cookies.cart ? JSON.parse(req.cookies.cart) : [];
    cart.push(productId);

    res.cookie("cart", JSON.stringify(cart), {
      maxAge: 24 * 60 * 60 * 1000
    });
  }

  res.redirect("/cart");
});


// 🔹 VIEW CART
app.get("/cart", (req, res) => {
  let cartItems = [];

  if (req.session.user) {
    cartItems = req.session.cart || [];
  } else {
    cartItems = req.cookies.cart ? JSON.parse(req.cookies.cart) : [];
  }

  const items = cartItems.map(id => products.find(p => p.id === id));
  res.render("cart", { items });
});


// 🔹 LOGIN PAGE
app.get("/login", (req, res) => {
  res.render("login");
});


// 🔹 LOGIN (Cart Migration happens here)
app.post("/login", (req, res) => {
  req.session.user = "Kaustubhi";

  // 🔥 MIGRATION LOGIC
  let cookieCart = req.cookies.cart ? JSON.parse(req.cookies.cart) : [];

  if (!req.session.cart) req.session.cart = [];

  req.session.cart = [...req.session.cart, ...cookieCart];

  // Clear cookie cart after migration
  res.clearCookie("cart");

  res.redirect("/cart");
});


// 🔹 LOGOUT
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});


// Start server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});