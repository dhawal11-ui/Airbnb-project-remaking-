const express = require("express");
const app = express();

app.get("/getcookies", (req, res) => {
  res.cookie("greet", "namaste"); // name value pairs . // name of the cookie - greet ; value of the cookie- hello/
  res.cookie(`madeIn`, `India`);
  res.send(`send some cookies !`);
});

const users = require("./routes/user.js");
const posts = require("./routes/post.js");

// app.use("/", users); // jaise he "/" likha browser meh uske age jo v likha ho woh router object(users) se compare hoga . then jo match huwa woh path per req jayegi
// but an efficient way
app.use("/users", users);
app.use("/posts", posts);

app.get("/", (req, res) => {
  res.send(`Hi I am root`);
});

app.listen(3000, () => {
  console.log(`server is listing on port 3000`);
});
