const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");

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

app.get("/", (req, res) => {
  res.send("hi Root");
});

// app.get("/testlisting", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "My new Villa",
//     description: "By the beach",
//     price: 1200,
//     location: "Calangute, Goa",
//     country: "India",
//   });
//   await sampleListing.save();
//   console.log("sample listing was saved");
//   res.send("successful");
// });

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
  // let {title,descripton,image,price,country,location} = req.body;
  let retriveListing = req.body.listing;
  const parseListing = new Listing(retriveListing); // ek instance banadiya
  await parseListing.save();
  console.log(parseListing);
  res.redirect("/listings");
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

app.listen(8080, () => {
  console.log("server is on 8080");
});
