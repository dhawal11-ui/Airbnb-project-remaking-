const express = require("express");
const router = express.Router();

//post

// INdex router for users
router.get("/", (req, res) => {
  res.send(`get for post`);
});

//show route
router.get("/:id", (req, res) => {
  res.send(`get for show post`);
});

//post
router.post("/", (req, res) => {
  res.send(`post for post`);
});

//delete post
router.delete("/:id", (req, res) => {
  res.send(`delelete for post`);
});

module.exports = router;
