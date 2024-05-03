// models/Post.js
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Post = sequelize.define(
  "Post",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    desc: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    tag: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING, // URL of the image
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Post;
