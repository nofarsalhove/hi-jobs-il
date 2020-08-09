const express = require("express");
const app = express();
const http = require("http").Server(app);
const mongoose = require("mongoose");
const cors = require("cors");

const users = require("./routes/users");
const auth = require("./routes/auth");
const posts = require("./routes/posts");

mongoose
  .connect("mongodb://localhost/hi_jobs_IL", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("Connected to MongoDB..."))
  .catch(err => console.error("Could not connect to MongoDB"));

//let all domains make requests to the server
app.use(cors());
// getting and sending data as JSON format
app.use(express.json());

app.use("/api/users", users);
app.use("/api/auth", auth);
app.use("/api/posts", posts);

const port = 8181;
http.listen(port, () => console.log(`Listen on port ${port}`));
