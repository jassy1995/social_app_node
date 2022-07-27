const Task = require("../models/task.model");

exports.createTask = async (req, res, next) => {
  const newTask = new Task({
    text: req.body.text,
    venue: req.body.venue,
    remainder: Boolean(req.body.remainder),
    day: req.body.day,
  });
  const task = await newTask.save();
  return res.send({
    _id: task._id,
    text: task.text,
    venue: task.venue,
    remainder: task.remainder,
    day: task.day,
  });
};

exports.updateTask = async (req, res, next) => {
  const task = await Task.findById(req.params.id);
  if (task) {
    task.text = req.body.text || task.text;
    task.venue = req.body.venue || task.venue;
    task.remainder =
      (req?.body?.remainder && Boolean(req.body.remainder)) || task.remainder;
    task.day = req.body.day || task.day;

    const updatedTask = await task.save();
    return res.send({
      _id: updatedTask._id,
      text: updatedTask.text,
      venue: updatedTask.venue,
      remainder: updatedTask.remainder,
      day: updatedTask.day,
    });
  } else {
    return res.status(404).send({ message: "Task not found" });
  }
};

exports.getTasks = async (req, res, next) => {
  const tasks = await Task.find({});
  return res.send(tasks);
};

exports.getTask = async (req, res, next) => {
  const task = await Task.findById(req.params.id);
  if (task) {
    return res.send(task);
  } else {
    return res.status(404).send({ message: "Task Not Found" });
  }
};

exports.deleteTask = async (req, res, next) => {
  const task = await Task.findById(req.params.id);
  if (task) {
    await task.remove();
    return res.send({ message: "task Deleted" });
  } else {
    return res.status(404).send({ message: "task Not Found" });
  }
};

exports.getPaginatedTask = async (req, res, next) => {
  const { query } = req;
  console.log(query);
  const pageNumber = +query.pageNumber || 1;
  const pageSize = +query.pageSize || 4;
  const tasks = await Task.find()
    .skip(pageSize * (pageNumber - 1))
    .limit(pageSize);
  const countTasks = await Task.countDocuments();
  console.log(tasks);
  return res.send({
    tasks,
    countTasks,
    pageNumber,
    pages: Math.ceil(countTasks / pageSize),
  });
};
