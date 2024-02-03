const User = require("../../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { localStrategy } = require("../../middlewares/passport");

const hash = async (password) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;  
}; 

const generateToken = async (user) => { 
  const payload = {
    username: user.username,
    id: user._id,
  };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_TOKEN_EXP });
  return token;
};

const signup = async (req, res, next) => {
  try {
   
    req.body.password = await hash(req.body.password);
    
    const newUser = await User.create(req.body);

    let token = generateToken(newUser);

    res
      .status(201)
      .json({ token: token, msg: "THE REQUEST WAS SUCCESSFULLY FULFILLED!" }); 

    } catch (err) {
      next(err);
    }
  };
  
  const signin = async (req, res, next) => {

    let token = generateToken(req.user); 
  res
    .status(201)
    .json({ token: token, msg: "THE REQUEST WAS SUCCESSFULLY FULFILLED!" });

    try {
    } catch (err) {
      res.status(500).json("Server Error");
    }
  };
  
  const getUsers = async (req, res, next) => {
    try {
      const users = await User.find().populate("urls");
      res.status(201).json(users);
    } catch (err) {
      next(err);
    }
  };
  module.exports = {
    signup,
    signin,
    getUsers,
  };

  