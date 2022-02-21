const express = require("express");
const { format } = require("morgan");
const Car = require("../models/Car");
const router = express.Router();

router.get("/", async (req, res) => {
  const cars = await Car.find();

  res.json({
    data: cars.map((car) => formatResponseData("cars", car.toObject())),
  });
});

router.post("/", async (req, res) => {
  let attributes = req.body.data.attributes;
  delete attributes._id;
  let newCar = new Car(attributes);
  await newCar.save();

  res.status(201).json({ data: formatResponseData("cars", newCar.toObject()) });
});

router.get("/:id", async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      throw new Error("Resource not found");
    }

    res.json({ data: formatResponseData("cars", car.toObject()) });
  } catch (error) {
    sendResourceNotFound(req, res);
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const { _id, ...attributes } = req.body.data.attributes;
    const car = await Car.findByIdAndUpdate(
      req.params.id,
      { _id: req.params.id, ...otherAttributes },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!car) {
      throw new Error("Resource not found");
    }
    res.json({ data: formatResponseData("cars", car.toObject()) });
  } catch (err) {
    sendResourceNotFound(req, res);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { _id, ...attributes } = req.body.data.attributes;
    const car = await Car.findByIdAndUpdate(
      req.params.id,
      { _id: req.params.id, ...otherAttributes },
      {
        new: true,
        overwrite: true,
        runValidators: true,
      }
    );
    if (!car) {
      throw new Error("Resource not found");
    }
    res.json({ data: formatResponseData("cars", car.toObject()) });
  } catch (err) {
    sendResourceNotFound(req, res);
  }
});

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

function sendResourceNotFound(req, res) {
  res.status(404).json({
    errors: [
      {
        status: "404",
        title: "Resource does not exist",
        description: `We could not find a car with id: ${req.params.id}`,
      },
    ],
  });
}

module.exports = router;
