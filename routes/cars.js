const express = require("express");
const Car = require("../models/Car");
const router = express.Router();

router.get("/", async (req, res) => {
  const cars = await Car.find();

  res.json({
    data: cars.map((car) => formatResponseData("cars", car.toObject())),
  });
});

router.post("/", async (req, res) => {});

router.get("/:id", async (req, res) => {});

router.patch("/:id", async (req, res) => {});

router.put("/:id", async (req, res) => {});

router.delete("/:id", async (req, res) => {});

/**
 * Format the response data object according to JSON:API v1.0
 * @param {string} type The resource collection name, e.g. 'cars'
 * @param {Object} resource An instance object from that collection
 * @returns
 */
function formatResponseData(type, resource) {
  const { _id, ...attributes } = resource;
  return { type, id: _id, attributes };
}

module.exports = router;
