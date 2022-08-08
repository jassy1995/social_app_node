require("dotenv").config();
const Post = require("../models/post.model");
const User = require("../models/user.model");
const cloudinary = require("../util/cloudinary");
const _ = require("lodash");




exports.createPost = async (req, res, next) => {
  const uploader = (data) =>
    new Promise((resolve, reject) => {
      cloudinary.uploader.upload(data.tempFilePath, (err, result) => {
        if (err) console.log(err);
        resolve(result);
      });
    });
  const postImg = await uploader(req.files.postImg);
  const newPost = new Post({ userId: req.user._id, desc: req.body.desc, img: postImg.secure_url, img_id: postImg.public_id });
  const post = await newPost.save();
  return res.send({ message: "Post Created", post });
};


exports.timeLinePost = async (req, res, next) => {
  const { query } = req;
  const pageNumber = +query.pageNumber || 1;
  const pageSize = +query.pageSize || 5;
  const checkUser = await User.findOne({ username: query.username });
  const userId = query.username === req.user.username ? req.user._id : checkUser._id;
  const currentUser = await User.findById(userId);
  const post = await Post.find({ userId: currentUser._id }).populate("userId").sort({ createdAt: -1 });
  const friendsPost = await Promise.all(
    currentUser.followings.map((friendId) => {
      return Post.find({ userId: friendId }).populate("userId").sort({ createdAt: -1 });
    })
  );

  const allValue = [...post, ...friendsPost.flat()]
  let divide = _.chunk(allValue, pageSize);
  const posts = divide[pageNumber - 1]
  return res
    .status(200)
    .send({
      posts,
      total_count: allValue.length,
      end: posts && posts.includes(allValue[allValue.length - 1]) ? true : false,
      message: "Post found",
    });
};

exports.postById = async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (post) {
    return res.send({ message: "post found", post });
  } else {
    return res.status(404).send({ message: "Post does Not Found" });
  }
};

exports.likeDislikePost = async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (post.userId !== req.user._id) {
    if (!post.likes.includes(req.user._id)) {
      await post.updateOne({ $push: { likes: req.user._id } });
      return res.status(200).send({ message: "The post has been like" });
    } else {
      await post.updateOne({ $pull: { likes: req.user._id } });
      return res.status(200).send({ message: "The post has been dislike" });
    }
  } else {
    return res
      .status(403)
      .send({ message: "you can not like/dislike your post" });
  }
};

exports.updatePost = async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (post) {
    if (post.userId === req.user._id) {
      req.body.desc = req.body.desc || post.desc;
      req.body.img = req.body.img || post.img;
      await Post.updateOne(
        { _id: req.params.id },
        {
          $set: req.body,
          $currentDate: { lastUpdated: true },
        }
      );
      const updatedPost = await Post.findById(req.params.id);
      return res.send({
        message: "updated successfully",
        post: updatedPost,
      });
    } else {
      res.status(403).send({ message: "You can only update your post" });
    }
  } else {
    res.status(404).send({ message: "Post Not Found" });
  }
};

exports.deletePost = async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (post) {
    if (post.userId === req.user._id) {
      await post.deleteOne();
      return res.send({
        message: "post deleted successfully",
      });
    } else {
      res.status(403).send({ message: "You can only delete your post" });
    }
  } else {
    res.status(404).send({ message: "Post Not Found" });
  }
};




