const express = require("express");
const router = express.Router();
const Joi = require("@hapi/joi");
const bcrypt = require("bcrypt");
const { User } = require("../models/user");

router.post("/", async (req, res) => {
  // check is the user's details valid according to the schma
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //   check if there is a user in the DB that he have that email
  let user = await User.findOne({ email: req.body.email });
  //   if there isn't user with the user's email we send error - must to be registered before
  if (!user) return res.status(400).send("Invalid email or password.");

  //   else, if there is a user with this email we compare between the passwords to check equivalent
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  //   if the password not equal to the user's password
  if (!validPassword) return res.status(400).send("Invalid email or password.");

  //   if the user's input details equivalent to the user's details in the DB
  //   we create him a token and send it to the client side (response)
  res.json({ token: user.generateAuthToken() });
});

function validate(req) {
  const schema = Joi.object({
    email: Joi.string()
      .min(6)
      .max(255)
      .required()
      .email(),
    password: Joi.string()
      .min(6)
      .max(1024)
      .required()
  });

  return schema.validate(req);
}

module.exports = router;
