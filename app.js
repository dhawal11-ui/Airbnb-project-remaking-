const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

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
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.get("/", (req, res) => {
  res.send("hi Root");
});

//Index Route
app.get("/listings", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
});

//New Route -> upr isliye likha taki new ko id na samaj le js
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs"); // Corrected path
});

//Create route
app.post("/listings", async (req, res) => {
  try {
    // let {title,descripton,image,price,country,location} = req.body;
    let retriveListing = req.body.listing;
    // ensure price is numeric (mongoose will also cast but validating early)

    const parseListing = new Listing(retriveListing); // ek instance banadiya
    await parseListing.save();
    console.log(parseListing);
    res.redirect("/listings");
  } catch {
    throw new Error(" title errors ");
  }
});

//Edit route
app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  const findListing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing: findListing }); // find listing ki value ko change kiya for easy way .
  // note -> findListing:listing X
});

// Update Route
app.put("/listings/:id", async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
});

app.delete("/listings/:id", async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings");
});

//Show route
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  const dataListing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing: dataListing }); // data listing ka name changge kiya hai bas to make it easy to redable
});

// error-handler.js
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack for debugging
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something broke!";

  // Check if headers have already been sent to avoid errors
  if (res.headersSent) {
    return next(err);
  }

  // Send the error response
  res.status(statusCode).send(message);
});

app.listen(8080, () => {
  console.log("server is on 8080");
});
