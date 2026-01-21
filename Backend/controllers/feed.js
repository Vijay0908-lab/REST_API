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
  const title = req.body.title;
  const content = req.body.content;
  // Create post in db
  res.status(201).json({
    message: "Post created successfully!",
    post: {
      _id: new Date().toISOString(),
      title: title,
      content: content,
      creator: {
        name: "vijay",
      },
      createdAt: new Date(),
    },
  });
};
