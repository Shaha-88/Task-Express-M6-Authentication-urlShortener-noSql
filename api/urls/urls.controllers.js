const Url = require("../../models/Url");
const shortid = require("shortid");
const User = require("../../models/User");

const baseUrl = "http:localhost:8000/urls";

exports.shorten = async (req, res) => {
  // create url code
  const urlCode = shortid.generate();
  try {
    req.body.shortUrl = `${baseUrl}/${urlCode}`;
    req.body.urlCode = urlCode;
    req.body.userId = req.params.userId;
    const newUrl = await Url.create(req.body);
    await User.findByIdAndUpdate(req.params.userId, {
      $push: { urls: newUrl._id },
    });
    res.json(newUrl);
  } catch (err) {
    next(err);
  }
};

exports.redirect = async (req, res) => {
  try {
    const url = await Url.findOne({ urlCode: req.params.code });
    if (url) {
      return res.redirect(url.longUrl);
    } else {
      return res.status(404).json("No URL Found");
    }
  } catch (err) {
    next(err);
  }
};

exports.deleteUrl = async (req, res) => {
  try {
    const url = await Url.findOne({ urlCode: req.params.code });
    if (url) {
      if (url.userId.equals(req.user._id)) {
        await url.deleteOne();
        return res.status(204).end();
      } else {
        return res.status(401).json({ message: "YOU SHALL NOT PASS!" });
      }
      
    } else {
      return res.status(404).json("NO URL FOUND!");
    }
  } catch (err) {
    next(err);
  }}