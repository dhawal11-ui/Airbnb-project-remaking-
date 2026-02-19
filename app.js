const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");

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

//Show route
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  const dataListing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing: dataListing }); // data listing ka name changge kiya hai bas to make it easy to redable
});

app.listen(8080, () => {
  console.log("server is on 8080");
});
