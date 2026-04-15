import User from "./user.js";
import bcrypt from "bcrypt";

async function createUser(req, res) {
  try {
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
      return res.render("signup", {
        error: "All fields are required"
      });
    }


    if (password.length > 14) {
      return res.render("signup", {
        error: "Password must be 14 characters or less"
      });
    }

    const isEmail = await User.findOne({ email });
    if (isEmail) {
      return res.render("signup", {
        error: "Email already exists"
      });
    }
    const isUsername = await User.findOne({ username });
    if (isUsername) {
      return res.render("signup", {
        error: "Username already taken"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      username,
      password: hashedPassword,
    });

    await newUser.save();
    return res.render("login", {
      success: "Account created successfully!"
    });

    // OR redirect:
    // res.redirect("/");

  } catch (error) {
    console.error(error);

    if (error.code === 11000) {
      return res.render("signup", {
        error: "Duplicate field value"
      });
    }

    return res.render("signup", {
      error: "Server error"
    });
  }
}

export default createUser;