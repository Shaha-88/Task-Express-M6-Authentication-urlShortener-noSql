const express = require('express');

const router = express.Router();

const { shorten, redirect, deleteUrl } = require('./urls.controllers');
const passport = require("passport");
router.post("/shorten",passport.authenticate("jwt", { session: false }),
shorten);

router.get('/:code', redirect);
router.delete('/:code', deleteUrl);
passport.authenticate("jwt", { session: false })
  
module.exports = router;
