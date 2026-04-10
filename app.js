const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

const MONGO_URl = "mongodb://127.0.0.1:27017/wanderlust";
async function main() {
  // making main function
  await mongoose.connect(MONGO_URl);
}

main()
  .then(() => {
    // calling main function
    console.log("connected to db");
  })
  .catch(() => {
    console.log(err);
  });

// setup for ejs
app.engine("ejs", ejsMate); // register ejs-mate before setting view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

app.get("/", (req, res) => {
  res.send("hi Root");
});

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

app.all(/.*/, (req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

// error-handler.js
app.use((err, req, res, next) => {
  let { statusCode = 501, message = "explicit message" } = err;
  res.status(statusCode).render("listings/error.ejs", { err });
});

app.listen(8080, () => {
  console.log("server is on 8080");
});
