const express = require("express");
const router = express.Router();
const { Post, validatePost } = require("../models/post");
const auth = require("../middleware/auth");
const _ = require("lodash");

// getting all posts we have in the DB
router.get("/", auth, async (req, res) => {
  const posts = await Post.find()
    .sort({ createdAt: -1 })
    .populate("user_id", ["name", "recruiter"]);
  if (!posts) res.status(404).send("There are not posts to show");
  res.send(posts);
});

// getting all recruiter's posts
router.get("/my-posts", auth, async (req, res) => {
  if (!req.user.recruiter) return res.status(401).send("Access denied.");
  const posts = await Post.find({ user_id: req.user._id })
    // sorting the posts by created date
    .sort({ createdAt: -1 })
    // join between the collection with forign key user_id and get only the recruiter name from users collection
    .populate("user_id", ["name", "recruiter"]);
  res.send(posts);
});

router.delete("/:id", auth, async (req, res) => {
  let post = await Post.findByIdAndRemove({
    _id: req.params.id,
    user_id: req.user._id
  });
  if (!post)
    return res.status(404).send("The post with the given ID was not found.");
  res.send(post);
});

router.put("/:id", auth, async (req, res) => {
  const { error } = validatePost(req.body);
  if (error) res.status(400).send(error.details[0].message);

  let post = await Post.findOneAndUpdate(
    { _id: req.params.id, user_id: req.user._id },
    req.body
  );
  if (!post)
    return res.status(404).send("The card with the given ID was not found.");

  post = await Post.findOne({ _id: req.params.id, user_id: req.user._id });
  res.send(post);
});

router.get("/:id", auth, async (req, res) => {
  const post = await Post.findOne({
    _id: req.params.id,
    user_id: req.user._id
  });
  if (!post) res.status(404).send("The post with the given ID was not found.");
  res.send(post);
});

router.post("/", auth, async (req, res) => {
  // checking if the post's details are valid according to the post schema
  const { error } = validatePost(req.body);
  if (error) res.status(400).send(error.details[0].message);

  let post = new Post({
    title: req.body.title,
    company: req.body.company,
    jobDescription: req.body.jobDescription,
    jobRequirements: req.body.jobRequirements,
    category: req.body.category,
    user_id: req.user._id
  });

  let response = await post.save();
  res.send(response);
});

module.exports = router;
