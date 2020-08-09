const express = require("express");
const router = express.Router();
const { User, validate, validatePosts } = require("../models/user");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const auth = require("../middleware/auth");
const { Post } = require("../models/post");

// getting a spesific posts like user favorite
const getPosts = async postsArr => {
  const posts = await Post.find({ _id: { $in: postsArr } })
    .sort({
      createdAt: -1
    })
    .populate("user_id", "name");
  return posts;
};

router.get("/posts", auth, async (req, res) => {
  let user = await User.findById(req.user._id).select("-password");
  const posts = await getPosts(user.posts);
  res.send(posts);
});

router.patch("/posts", auth, async (req, res) => {
  const { error } = validatePosts(req.body);
  if (error) res.status(400).send(error.details[0].massage);

  const posts = await getPosts(req.body.posts);
  if (posts.length != req.body.posts.length)
    res.status(400).send("Post numbers don't match");

  let user = await User.findById(req.user._id).select("-password");
  user.posts = req.body.posts;
  user = await user.save();
  res.send(user);
});

router.get("/me", auth, async (req, res) => {
  // getting the user's details from DB
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});

router.post("/", async (req, res) => {
  // checking if the user's details are valid according to the schema
  const { error } = validate(req.body);
  if (error) res.status(400).send(error.details[0].message);

  //  check if there is already user with the same email
  let user = await User.findOne({ email: req.body.email });
  if (user) res.status(400).send("User already registered");

  //  creating an object from type User with the user's details
  user = new User(
    _.pick(req.body, ["name", "email", "password", "recruiter", "posts"])
  );
  //  encrypting the user's password before we save it in the DB
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  //   adding the user to the DB in the User collection
  await user.save();
  //   return an response to the user with the user details after we added the user to the DB
  res.send(_.pick(user, ["_id", "name", "email"]));
});

module.exports = router;
