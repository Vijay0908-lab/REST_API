//const { check } = require("express-validator");

const { validationResult } = require("express-validator");
const Post = require("../model/post");
exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [
      {
        _id: "1",
        creator: {
          name: "vijay",
        },
        createdAt: new Date(),
        title: "First Post",
        content: "This is the second!",
        imageUrl: "/images/coconut.jpg",
      },
    ],
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
  const title = req.body.title;
  const content = req.body.content;

  const post = new Post({
    title: title,
    content: content,
    imageUrl: "images/coconut.jpeg",
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
      if (err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
