const express = require("express");
const router = express.Router();

// INdex router for users
router.get("/", (req, res) => {
  res.send(`get for users`);
});

//show route
router.get("/:id", (req, res) => {
  res.send(`get for show users`);
});

//post
router.post("", (req, res) => {
  res.send(`post for users`);
});

//delete users
router.delete("/:id", (req, res) => {
  res.send(`delelete for users`);
});

module.exports = router;
