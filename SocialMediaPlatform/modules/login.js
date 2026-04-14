import User from "./user.js";
import { StatusCodes } from "http-status-pro-js";
import bcrypt from "bcrypt";
import logger from "../logger/logger.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();
async function login(req, res) {
  try { 
    let { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).send("Email and password are required");
    }
    const user =  await User.findOne({ email });
    if (!user) {
      return res.status(401).send("Email or password is wrong");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send("Email or password is wrong");
    }
    const token = jwt.sign(
      { id: user._id,name:user.name, email: user.email,username: user.username },
        process.env.TOKENKEY,
        { expiresIn: "1h" }
    );

    res.cookie("token", token, { httpOnly: true });
    res.redirect("/dashboard");
  }
    catch(error){
        console.log(error.message);
        logger("error", StatusCodes.INTERNAL_SERVER_ERROR.message)
        
        res.status(StatusCodes.INTERNAL_SERVER_ERROR.code).json({
            code: StatusCodes.INTERNAL_SERVER_ERROR.code,
            message: StatusCodes.INTERNAL_SERVER_ERROR.message,
            data: null
        })
    }
}

export default login;
