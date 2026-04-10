const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,

  loginTime: Date,
  logoutTime: Date,
  lastActive: Date
});


// 🔹 Middleware: Before saving user (LOGIN)
userSchema.pre("save", function (next) {
  if (!this.loginTime) {
    this.loginTime = new Date();
  }
  this.lastActive = new Date();
  next();
});


// 🔹 Middleware: Before update (LAST ACTIVE)
userSchema.pre("findOneAndUpdate", function (next) {
  this.set({ lastActive: new Date() });
  next();
});


// 🔹 Method: Logout
userSchema.methods.logout = function () {
  this.logoutTime = new Date();
  this.lastActive = new Date();
  return this.save();
};

module.exports = mongoose.model("User", userSchema);