const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { validateReview, validateListing } = require("../utils/validateFunctions.js");
const listingSchema = require("../utils/schema.js");
const { reviewSchema } = require("../utils/schema.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

//Index Route
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  }),
);

//New Route -> upr isliye likha taki new ko id na samaj le js
router.get("/new", (req, res) => {
  res.render("listings/new.ejs");
});

//Create route
router.post(
  "/",
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
router.get(
  "/:id/edit",
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const findListing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing: findListing }); // find listing ki value ko change kiya for easy way .
    // note -> findListing:listing X
  }),
);

// Update Route
router.put(
  "/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    if (!req.body.listing) {
      throw new ExpressError(
        400,
        "bad req form client , send a valid data for update ",
      );
    }
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
  }),
);

router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
  }),
);

//Show route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const dataListing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { listing: dataListing }); // data listing ka name changge kiya hai bas to make it easy to redable
  }),
);

//Reviews post route -->post ke ander reviews ki _id store kare hai
router.post(
  "/:id/reviews",
  validateReview,
  wrapAsync(async (req, res) => {
    let { id } = req.body;
    let getListing = await Listing.findById(req.params.id).populate("reviews");
    let newReview = new Review(req.body.review);

    getListing.reviews.push(newReview);

    await newReview.save();
    await getListing.save();

    console.log("new review saved");

    res.send("review saved");
  }),
);

// //Review delete route
router.delete(
  "/:id/reviews/:reviewId",
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;

    // id se lisitngs mili uske andr reviews me gye waha se woh wala review dhunde using reviewId
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); // ab yaha per pull operator hoga listing.review[] se review hatane ke liye.
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
  }),
);

module.exports = router;
