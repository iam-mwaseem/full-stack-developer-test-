const User = require("./../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.signup = async (req, res) => {
  try {
    const { name, email, password, passwordConfirm } = req.body;

    const user = await User.create({
      name,
      email,
      password,
      passwordConfirm,
    });

    return res.status(200).json({
      message: "Successfull",
      user,
    });
  } catch (error) {
    throw new Error(error.message);
  }
};
exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new Error("Please provide your email and password");
    }

    const user = await User.findOne({ email }).select("password");

    const correct = await bcrypt.compare(password, user.password);

    if (!user || !correct) {
      throw new Error("Email or password is incorrect");
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    res.status(200).json({
      status: "success",
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    throw new Error("You're not logged in, Please login to get access ");
  }

  const decoded = await jwt.verify(token, process.env.JWT_SECRET);
  console.log(decoded.iat);

  //Check if user still exist
  let currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    throw new Error("The user belongs to token is no longer exist");
  }

  //Check if the user is blocked by admin after issuing token

  if (!currentUser.isActive) {
    throw new Error("You're blocked! Please try to login after some time");
  }

  //Check if user changed password after the token issued

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    throw new Error("User recently changed password, Please login again!");
  }

  next();
};
