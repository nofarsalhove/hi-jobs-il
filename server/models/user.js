const Joi = require("@hapi/joi");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255
  },
  email: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 255,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    password: 1024
  },
  recruiter: {
    type: Boolean,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  posts: Array
});

// creating a token base on the user's id, user's recruiter field as payload and a key
userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    { _id: this._id, recruiter: this.recruiter },
    config.get("jwtKey")
  );
  return token;
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string()
      .min(2)
      .max(255)
      .required(),
    email: Joi.string()
      .min(6)
      .max(255)
      .required()
      .email(),
    password: Joi.string()
      .min(6)
      .max(1024)
      .required(),
    recruiter: Joi.boolean().required()
  });
  return schema.validate(user);
}

function validatePosts(data) {
  const schema = Joi.object({
    posts: Joi.array()
  });

  return schema.validate(data);
}

exports.User = User;
exports.validate = validateUser;
exports.validatePosts = validatePosts;
