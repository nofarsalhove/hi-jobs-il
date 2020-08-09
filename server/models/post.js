const Joi = require("@hapi/joi");
const mongoose = require("mongoose");
const _ = require("lodash");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    minlength: 2,
    maxlength: 255,
    required: true
  },
  company: {
    type: String,
    minlength: 2,
    maxlength: 255,
    required: true
  },
  jobDescription: {
    type: String,
    minlength: 2,
    maxlength: 1024,
    required: true
  },
  jobRequirements: {
    type: String,
    minlength: 2,
    maxlength: 1024,
    required: true
  },
  category: {
    type: String,
    minlength: 2,
    maxlength: 255,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

const Post = mongoose.model("Post", postSchema);

function validatePost(post) {
  const schema = Joi.object({
    title: Joi.string()
      .min(2)
      .max(255)
      .required(),
    company: Joi.string()
      .min(2)
      .max(255)
      .required(),
    jobDescription: Joi.string()
      .min(2)
      .max(1024)
      .required(),
    jobRequirements: Joi.string()
      .min(2)
      .max(1024)
      .required(),
    category: Joi.string()
      .min(2)
      .max(255)
      .required()
  });

  return schema.validate(post);
}

exports.Post = Post;
exports.validatePost = validatePost;
