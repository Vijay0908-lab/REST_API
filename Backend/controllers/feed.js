//const { check } = require("express-validator");

const { validationResult } = require("express-validator");
const Post = require("../model/post");

exports.getPosts = (req, res, next) => {
  Post.find().then((posts) => {
    res.status(200).json({ message: "Fetched the data", posts: posts });
  });
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);

  // Create post in db

  if (!errors.isEmpty()) {
    const error = new Error("validation failed entered data is incorrect");
    error.statusCode = 422;
    throw error;
  }

  if (!req.file) {
    const error = new Error("No image provided");
    error.statusCode = 422;
    throw error;
  }

  const imageUrl = req.file.path;
  const title = req.body.title;
  const content = req.body.content;

  const post = new Post({
    title: title,
    content: content,
    imageUrl: imageUrl,
    creator: { name: "Vijay" },
  });
  post
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Post created successfully!",
        post: result,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getPost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Could not find post");
        error.statusCode = 404;
        throw error;
      }
      return res.status(200).json({ message: "post fetched.", post: post });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
