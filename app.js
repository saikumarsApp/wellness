// app.js
const express = require("express");
const bodyParser = require("body-parser");
const sequelize = require("./config/database");
const Post = require("./models/Post");
const upload = require("./utils/s3Upload");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Get all posts with options
app.get("/posts", async (req, res) => {
  let { page, size, sort, tag, keyword } = req.query;
  page = page || 1;
  size = size || 10;
  const limit = parseInt(size);
  const offset = (page - 1) * size;

  let where = {};
  if (keyword)
    where = {
      [Sequelize.Op.or]: [
        { title: { [Sequelize.Op.iLike]: `%${keyword}%` } },
        { desc: { [Sequelize.Op.iLike]: `%${keyword}%` } },
      ],
    };
  if (tag) where.tag = tag;

  try {
    const posts = await Post.findAndCountAll({
      where,
      limit,
      offset,
      order: [["createdAt", sort || "DESC"]],
    });
    res.json(posts);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

// Insert a post
app.post("/posts", upload.single("image"), async (req, res) => {
  const { title, desc, tag } = req.body;
  try {
    const post = await Post.create({
      title,
      desc,
      tag,
      image: req.file ? req.file.location : null,
    });
    res.status(201).json(post);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

// Initialize database and start server
sequelize
  .sync()
  .then(() => {
    app.listen(3000, () =>
      console.log("Server running on http://localhost:3000")
    );
  })
  .catch((err) => console.log("Error: " + err));
