const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const defaultImg =
  "https://plus.unsplash.com/premium_photo-1670425787311-6803b284baf4?q=80&w=1015&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    type: Schema.Types.Mixed, // Allow objects or strings
    default: defaultImg,
    set: (v) => {
      if (typeof v === "object" && v.url) {
        return v.url; // Extract URL if object
      }
      return v || defaultImg; // Use default if empty
    },
  },
  price: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  location: String,
  country: String,
  reviews: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    default: [],
  },
});

// listing schema post middleware -> jaise he find by id call hoga koi listing ke liye toh yeh middlware v call hoga.
listingSchema.post("findOneAndDelete", async (listingData) => {
  if (listingData) {
    await Review.deleteMany({ _id: { $in: listingData.reviews } }); // lisitng ki id ka yeh part hogi toh un sab reviews ki list banjayagi using($in) then woh sab delete hojayega using delte many
  }
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
