const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  make: String,
  model: String,
  colour: { type: String },
});
const Model = mongoose.model("Car", schema);

module.exports = Model;
