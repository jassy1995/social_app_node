const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../util/scripts/jwt");
const validateLogin = require("../validator/user/login-validator");
const validateRegister = require("../validator/user/register-validator");

exports.createUser = async (req, res, next) => {
 
  const { error } = validateRegister(req.body);
  if (error) return res.status(200).send({ message: error.details[0].message ,status:false});
  else{
    const userExists = await User.findOne({username: req.body.username.trim(),email: req.body.email.trim()});
    if (userExists) return res.status(200).json({ message: 'username already taken, please use another username',status:false });
    else{
      const { username, email, password } = req.body;
      const newUser = new User({
      username,
      email,
      password: bcrypt.hashSync(password),
    });
    const user = await newUser.save();
    return res.send({ ...user._doc, token: generateToken(user) ,status:true});
    } 
  }
  
  
};

exports.loginUser = async (req, res, next) => {
  console.log(req.body);
  const { error } = validateLogin(req.body);
  if (error) return res.status(200).send({ message: error.details[0].message ,status:false});
  else{
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(200).send({ message: "user not found" ,status:false});
    const validPassword = bcrypt.compareSync(req.body.password, user.password);
    if (!validPassword) {
      return res.status(200).send({ message: "incorrect password" ,status:false});
    }
    return res.status(200).send({ ...user._doc, token: generateToken(user) ,status: true }); 
  }
 
};
