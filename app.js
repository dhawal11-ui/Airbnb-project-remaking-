const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
// the module exports a Joi schema directly, so require it without destructuring
const listingSchema = require("./utils/schema.js");

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

const validateListing = (req, res, next) => {
  // ensure body exists and contains a `listing` object
  if (!req.body || typeof req.body !== "object" || !req.body.listing) {
    throw new ExpressError(400, "Request body must include a listing object");
  }
  const { error } = listingSchema.validate(req.body, { abortEarly: false });
  if (error) {
    // consolidate details into one message
    const errorMsg = error.details.map((el) => el.message).join(", ");
    // sare error detaisl se msg nikalo (el) then join with ','
    throw new ExpressError(400, errorMsg);
  }
  next();
};

//Index Route
app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  }),
);

//New Route -> upr isliye likha taki new ko id na samaj le js
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

//Create route
app.post(
  "/listings",
  validateListing,
  wrapAsync(async (req, res, next) => {
    let retriveListing = req.body.listing;
    const parseListing = new Listing(retriveListing); // ek instance banadiya

    await parseListing.save();
    console.log(parseListing);
    res.redirect("/listings");
  }),
);

//Edit route
app.get(
  "/listings/:id/edit",
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const findListing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing: findListing }); // find listing ki value ko change kiya for easy way .
    // note -> findListing:listing X
  }),
);

// Update Route
app.put(
  "/listings/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    if (!req.body.listing) {
      throw new ExpressError(400, "bad req form client , send a valid data for update ");
    }
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
  }),
);

app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
  }),
);

//Show route
app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const dataListing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing: dataListing }); // data listing ka name changge kiya hai bas to make it easy to redable
  }),
);

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
