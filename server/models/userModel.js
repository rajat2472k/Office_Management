const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Define the User schema
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    require: true,
  },
  lastName:{
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
  confirmPassword: {
    type: String,
    require: true,
  },
  role: {
    type: String,
    enum: ["admin", "manager", "user"],
  },
});

// During Password Hashing:  The pre middleware is defined within the userSchema before creating the User model. This ensures that the middleware is properly applied to user documents before they are saved to the database.

//? secure the password with the bcrypt
userSchema.pre("save", async function () {
  const user = this;


  if (!user.isModified) {
    return next();
  }

  try {
    const saltRound = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, saltRound);
    user.password = hashedPassword;
  } catch (error) {
    return next(error);
  }
});

userSchema.methods.generateToken = function () {
  return jwt.sign(
    {
      id: this._id,           // Used by verifyToken
      role: this.role         // Used by isAdmin
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: '30d' }
  );
};

//? define the model or the collection name
const User = new mongoose.model("User", userSchema);

module.exports = User;
