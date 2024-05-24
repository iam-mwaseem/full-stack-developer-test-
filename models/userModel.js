const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: validator.isEmail,
  },

  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false,
  },

  passwordConfirm: {
    type: String,
    validate: {
      validator: function (el) {
        if (this.password) {
          return el === this.password;
        }
      },
      message: "Passwords are not the same",
    },
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  changedPasswordAt: {
    type: Date,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;

  next();
});

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  let changedTimestamp;

  if (this.changedPasswordAt !== undefined) {
    changedTimestamp = parseInt(this.changedPasswordAt.getTime() / 1000, 10);

    return JWTTimestamp < changedTimestamp;
  }

  return false;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
