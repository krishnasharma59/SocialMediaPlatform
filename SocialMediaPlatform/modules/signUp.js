import User from "./user.js";
import bcrypt from  "bcrypt";
async function createUser(req, res) {
  try {
    const { name, username, email, password} = req.body;
    console.log(req.body);
    if (!name || !username || !email || !password) {
      return res.status(400).send("All fields are required");
    }

    let users = [];

    const isUser =  await User.findOne({ email });
    if (isUser) {
      return res.status(409).send("User already exists");
    }
    const hasPassword = await bcrypt.hash(password, 10);
    
    const newUser = new User({
      name,
      email,
      username,
      password:hasPassword,
    });

    await newUser.save();

    res.redirect("/");

  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
}

export default createUser;
