const express = require("express");
const { format } = require("morgan");
const Person = require("../models/Person");
const router = express.Router();

router.get("/", async (req, res) => {
  const people = await Person.find();

  res.json({
    data: people.map((person) =>
      formatResponseData("people", person.toObject())
    ),
  });
});

router.post("/", async (req, res) => {
  let attributes = req.body.data.attributes;
  delete attributes._id;
  let newPerson = new Person(attributes);
  await newPerson.save();

  res
    .status(201)
    .json({ data: formatResponseData("people", newPerson.toObject()) });
});

router.get("/:id", async (req, res) => {
  try {
    const person = await Person.findById(req.params.id);
    if (!person) {
      throw new Error("Resource not found");
    }

    res.json({ data: formatResponseData("people", person.toObject()) });
  } catch (error) {
    sendResourceNotFound(req, res);
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const { _id, ...attributes } = req.body.data.attributes;
    const person = await Person.findByIdAndUpdate(
      req.params.id,
      { _id: req.params.id, ...attributes },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!person) {
      throw new Error("Resource not found");
    }
    res.json({ data: formatResponseData("people", person.toObject()) });
  } catch (err) {
    sendResourceNotFound(req, res);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { _id, ...attributes } = req.body.data.attributes;
    const person = await Person.findByIdAndUpdate(
      req.params.id,
      { _id: req.params.id, ...attributes },
      {
        new: true,
        overwrite: true,
        runValidators: true,
      }
    );
    if (!person) {
      throw new Error("Resource not found");
    }
    res.json({ data: formatResponseData("people", person.toObject()) });
  } catch (err) {
    sendResourceNotFound(req, res);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const person = await Person.findByIdAndRemove(req.params.id);
    if (!person) throw new Error("Resource not found");
    res.json({ data: formatResponseData("people", person.toObject()) });
  } catch (error) {
    sendResourceNotFound(req, res);
  }
});

/**
 * Format the response data object according to JSON:API v1.0
 * @param {string} type The resource collection name, e.g. 'people'
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
        description: `We could not find a person with id: ${req.params.id}`,
      },
    ],
  });
}

module.exports = router;
