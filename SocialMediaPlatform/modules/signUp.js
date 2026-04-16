import User from "./user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

async function createUser(req, res) {
  try {
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
      return res.render("signUp", { error: "All fields are required" });
    }

    if (password.length > 14) {
      return res.render("signUp", {
        error: "Password must be 14 characters or less"
      });
    }


    const isEmail = await User.findOne({ email });
    if (isEmail) {
      return res.render("signUp", { error: "Email already exists" });
    }

    const isUsername = await User.findOne({ username });
    if (isUsername) {
      return res.render("signUp", { error: "Username already taken" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      username,
      password: hashedPassword
    });


    const token = jwt.sign(
      {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        username: newUser.username
      },
      process.env.TOKENKEY,
      { expiresIn: "1h" }
    );

    // 🍪 Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,     
      sameSite: "Lax"
    });

    return res.redirect("/dashboard");

  } catch (error) {
    console.error("signUp ERROR:", error);

    if (error.code === 11000) {
      if (error.keyPattern?.email) {
        return res.render("signUp", { error: "Email already exists" });
      }
      if (error.keyPattern?.username) {
        return res.render("signUp", { error: "Username already taken" });
      }
      return res.render("signUp", { error: "Duplicate data" });
    }

    return res.render("signUp", {
      error: "Something went wrong"
    });
  }
}

export default createUser;