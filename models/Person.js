const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: {
    first: String,
    last: String,
  },
  email: String,
  birthDate: Date,
  phone: Number,
  address: {
    streetNumber: String,
    streetName: String,
    city: String,
    region: String,
    country: String,
    postalCode: String,
  },
});
const Model = mongoose.model("Person", schema);

module.exports = Model;
