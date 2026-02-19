const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const defaultImg = "https://www.freepik.com/icons/default-image";

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
  price: Number,
  location: String,
  country: String,
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
