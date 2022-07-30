const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../util/scripts/jwt");

exports.updateUserInfo = async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (user) {
    req.body.name = req.body.name || user.name;
    req.body.email = req.body.email || user.email;
    req.body.password = req.body.password
      ? bcrypt.hashSync(req.body.password, 8)
      : user.password;

    await User.updateOne(
      { _id: req.user._id },
      {
        $set: req.body,
        $currentDate: { lastUpdated: true },
      }
    );
    return res.send({
      message: "updated successfully",
      token: generateToken(user),
    });
  } else {
    return res.status(404).send({ message: "User not found" });
  }
};

exports.getUsers = async (req, res, next) => {
  const users = await User.find({});
  return res.send(users);
};

exports.getUser = async (req, res, next) => {
  const user = await User.findOne({ username: req.params.username });
  if (user) {
    const { password, updatedAt, __v, ...others } = user._doc;
    return res.send(others);
  } else {
    return res.status(404).send({ message: "User Not Found" });
  }
};

exports.getUserById = async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (user) {
    const { password, updatedAt, __v, ...others } = user._doc;
    return res.send(others);
  } else {
    return res.status(404).send({ message: "User Not Found" });
  }
};

exports.follow = async (req, res, next) => {
  if (req.params.id !== req.user._id) {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);
    if (!userToFollow.followers.includes(currentUser._id)) {
      await userToFollow.updateOne({ $push: { followers: req.user._id } });
      await currentUser.updateOne({ $push: { followings: req.params.id } });
      return res.status(200).send({ message: "user has been follow" });
    } else {
      return res.status(403).send({
        message: `you are already follow  ${userToFollow.username}`,
      });
    }
  } else {
    return res.status(403).send({ message: "you can not follow yourself" });
  }
};

exports.unFollow = async (req, res, next) => {
  if (req.params.id !== req.user._id) {
    const userToUnFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);
    if (userToUnFollow.followers.includes(currentUser._id)) {
      await userToUnFollow.updateOne({ $pull: { followers: req.user._id } });
      await currentUser.updateOne({ $pull: { followings: req.params.id } });
      return res.status(200).send({ message: "user has been unfollow" });
    } else {
      return res
        .status(403)
        .send({ message: `you don't follow ${userToUnFollow.username}` });
    }
  } else {
    return res.status(403).send({ message: "you can not unfollow yourself" });
  }
};

exports.deleteUser = async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (user) {
    await User.deleteOne({ _id: req.params.id });
    return res.send({ message: "User Deleted" });
  } else {
    return res.status(404).send({ message: "User Not Found" });
  }
};

exports.getFriends = async (req, res, next) => {
  const { query } = req;
  const checkUser = await User.findOne({ username: query.username });
  const userId = query.username === req.user.username ? req.user._id : checkUser._id;
  const user = await User.findById(userId);
  const friends = await Promise.all(
    user.followings.map(friendId => {
      return User.findById(friendId)
    })
  )
  let friendList = [];
  friends.map(friend => {
    const { _id, username, profilePicture } = friend;
    friendList.push({ _id, username, profilePicture });
  })

  return res.send(friendList);
}
