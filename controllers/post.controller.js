require("dotenv").config();
const Post = require("../models/post.model");
const Todo = require("../models/todo.model");
const User = require("../models/user.model");
const cloudinary = require("../util/cloudinary");
const _ = require("lodash");

// const validateCreatePost = require("../validator/post/createPost-validator");



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

// exports.getPaginatedTask = async (req, res, next) => {
//   const { query } = req;
//   console.log(query);
//   const pageNumber = +query.pageNumber || 1;
//   const pageSize = +query.pageSize || 4;
//   const tasks = await Task.find()
//     .skip(pageSize * (pageNumber - 1))
//     .limit(pageSize);
//   const countTasks = await Task.countDocuments();
//   console.log(tasks);
//   return res.send({
//     tasks,
//     countTasks,
//     pageNumber,
//     pages: Math.ceil(countTasks / pageSize),
//   });
// };

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
  const allValue = [...post, ...friendsPost]
  let divide = _.chunk(allValue, pageSize);
  return res
    .status(200)
    .send({
      posts: divide[pageNumber - 1],
      total_count: divide.length,
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


exports.getTodo = async (req, res, next) => {
  const { query } = req;
  const pageNumber = +query.pageNumber || 1;
  const pageSize = +query.pageSize || 10;
  const status = query?.status;
  if (!!status && status !== 'all') {
    const statusFilter = status ? { completed: status.trim() === 'completed' ? true : false } : {};
    const todos = await Todo.find({ ...statusFilter })
      .skip(pageSize * (pageNumber - 1))
      .limit(pageSize);
    const countTodo = await Todo.countDocuments({ ...statusFilter });
    return res.send({
      todos,
      total_count: countTodo,
      pageNumber,
      total_page: Math.ceil(countTodo / pageSize),
    });
  } else {
    const todos = await Todo.find()
      .skip(pageSize * (pageNumber - 1))
      .limit(pageSize);
    const countTodo = await Todo.countDocuments();
    return res.send({
      todos,
      total_count: countTodo,
      pageNumber,
      total_page: Math.ceil(countTodo / pageSize),
    });
  }

}

// exports.allProduct = async (req, res, next) => {
//   const products = await Product.find();
//   return res.send(products);
// };

// exports.productByCategory = async (req, res, next) => {
//   const categories = await Product.find().distinct("category");
//   return res.send(categories);
// };

// exports.filterProduct = async (req, res, next) => {
//   const { query } = req;
//   const pageSize = query.pageSize || PAGE_SIZE;
//   const page = query.page || 1;
//   const category = query.category || "";
//   const price = query.price || "";
//   const rating = query.rating || "";
//   const order = query.order || "";
//   const searchQuery = query.query || "";

//   const queryFilter =
//     searchQuery && searchQuery !== "all"
//       ? {
//           name: {
//             $regex: searchQuery,
//             $options: "i",
//           },
//         }
//       : {};
//   const categoryFilter = category && category !== "all" ? { category } : {};
//   const ratingFilter =
//     rating && rating !== "all"
//       ? {
//           rating: {
//             $gte: Number(rating),
//           },
//         }
//       : {};

//   const priceFilter =
//     price && price !== "all"
//       ? {
//           // 1-50
//           price: {
//             $gte: Number(price.split("-")[0]),
//             $lte: Number(price.split("-")[1]),
//           },
//         }
//       : {};

//   const sortOrder =
//     order === "featured"
//       ? { featured: -1 }
//       : order === "lowest"
//       ? { price: 1 }
//       : order === "highest"
//       ? { price: -1 }
//       : order === "toprated"
//       ? { rating: -1 }
//       : order === "newest"
//       ? { createdAt: -1 }
//       : { _id: -1 };

//   const products = await Product.find({
//     ...queryFilter,
//     ...categoryFilter,
//     ...priceFilter,
//     ...ratingFilter,
//   })
//     .sort(sortOrder)
//     .skip(pageSize * (page - 1))
//     .limit(pageSize);

//   const countProducts = await Product.countDocuments({
//     ...queryFilter,
//     ...categoryFilter,
//     ...priceFilter,
//     ...ratingFilter,
//   });

//   return res.send({
//     products,
//     countProducts,
//     page,
//     pages: Math.ceil(countProducts / pageSize),
//   });
// };

// exports.getAdminProduct = async (req, res, next) => {
//   const { query } = req;
//   const page = query.page || 1;
//   const pageSize = query.pageSize || PAGE_SIZE;

//   const products = await Product.find()
//     .skip(pageSize * (page - 1))
//     .limit(pageSize)
//     .sort({ createdAt: -1 });
//   const countProducts = await Product.countDocuments();
//   return res.send({
//     products,
//     countProducts,
//     page,
//     pages: Math.ceil(countProducts / pageSize),
//   });
// };

// exports.productReview = async (req, res, next) => {
//   const productId = req.params.id;
//   const product = await Product.findById(productId);
//   if (product) {
//     if (product.reviews.find((x) => x.name === req.user.name)) {
//       return res
//         .status(400)
//         .send({ message: "You already submitted a review" });
//     }

//     const review = {
//       name: req.user.name,
//       rating: Number(req.body.rating),
//       comment: req.body.comment,
//     };
//     product.reviews.push(review);
//     product.numReviews = product.reviews.length;
//     product.rating =
//       product.reviews.reduce((a, c) => c.rating + a, 0) /
//       product.reviews.length;
//     const updatedProduct = await product.save();
//     return res.status(201).send({
//       message: "Review Created",
//       review: updatedProduct.reviews[updatedProduct.reviews.length - 1],
//       numReviews: product.numReviews,
//       rating: product.rating,
//     });
//   } else {
//     res.status(404).send({ message: "Product Not Found" });
//   }
// };
