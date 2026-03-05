const mongoose = require("mongoose");
const Schema = mongoose.Schema;
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
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
