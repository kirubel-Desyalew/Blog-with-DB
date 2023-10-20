//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent =
  "Welcome to My Personal Blog!This is my personal blog where I share my thoughts, experiences, and insights. It's a space where I can express myself freely and connect with others who resonate with my ideas. I invite you to join me on this journey and explore the world through my words.";

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/blogDB");

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Post = mongoose.model("post", postSchema);

const defaultItems = [homeStartingContent];

app.get("/", function (req, res) {
  Post.find(function (err, foundPosts) {
    res.render("home", {
      startingContent: homeStartingContent,
      posts: foundPosts,
    });
  });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", function (req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody,
  });

  post.save();

  res.redirect("/");
});

app.get("/posts/:postId", function (req, res) {
  const requestedPostId = req.params.postId;

  Post.findOne({ _id: requestedPostId }, function (err, post) {
    res.render("post", {
      title: post.title,
      content: post.content,
    });
  });
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
