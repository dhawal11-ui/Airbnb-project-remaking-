const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { validateReview } = require("../utils/validateFunctions.js");
const ExpressError = require("../utils/ExpressError.js");

const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

//Reviews post route -->post ke ander reviews ki _id store kare hai
router.post(
  "/",
  validateReview,
  wrapAsync(async (req, res) => {
    let getListing = await Listing.findById(req.params.id).populate("reviews");
    let newReview = new Review(req.body.review);

    getListing.reviews.push(newReview);

    await newReview.save();
    await getListing.save();

    console.log("new review saved");
    console.log(req.params.id); // check ( not printing on console)

    res.redirect(`/listings/${req.params.id}`);
  }),
);

// //Review delete route
router.delete(
  "/:reviewId",
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;

    // id se lisitngs mili uske andr reviews me gye waha se woh wala review dhunde using reviewId
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); // ab yaha per pull operator hoga listing.review[] se review hatane ke liye.
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
  }),
);

module.exports = router;
