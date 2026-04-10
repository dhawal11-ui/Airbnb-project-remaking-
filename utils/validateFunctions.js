const listingSchema = require("../utils/schema.js");
const reviewSchema = require("../utils/schema.js").reviewSchema;

//Review Validations
const validateReview = (req, res, next) => {
  // ensure body exists and contains a `review` object
  if (!req.body || typeof req.body !== "object" || !req.body.review) {
    throw new ExpressError(400, "Request body must include a review object");
  }
  const { error } = reviewSchema.validate(req.body, { abortEarly: false });
  if (error) {
    // consolidate details into one message
    const errorMsg = error.details.map((el) => el.message).join(", ");
    // sare error detaisl se msg nikalo (el) then join with ','
    throw new ExpressError(400, errorMsg);
  }
  next();
};

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

module.exports = { validateReview, validateListing };
