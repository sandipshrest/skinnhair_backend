const express = require("express");
const FeedbackRepo = require("../../database/repository/FeedbackRepo");
const validator = require("../../helpers/validator");
const schema = require("../access/schema");

const router = express.Router();

// post new feedback
router.post("/", validator(schema.feedback), async (req, res) => {
  try {
    const feedback = await FeedbackRepo.create({
      ...req.body,
    });
    res.status(200).json({ message: "Feedback added successfully!", feedback });
  } catch (err) {
    console.log(err);
  }
});

// get all feedback
router.get("/", async (req, res) => {
  try {
    const allFeedback = await FeedbackRepo.getAll();
    res
      .status(200)
      .json({ message: "Feedback fetched successfully!", allFeedback });
  } catch (err) {
    console.log(err);
  }
});

// get all feedback of specific user
router.get("/user/:userId", async (req, res) => {
  try {
    const allFeedback = await FeedbackRepo.getFeedbackByUser(req.params.userId);
    res
      .status(200)
      .json({ message: "Feedback fetched successfully!", allFeedback });
  } catch (err) {
    console.log(err);
  }
});

// get all feedback of specific product
router.get("/product/:productId", async (req, res) => {
  try {
    const allFeedback = await FeedbackRepo.getFeedbackByProduct(
      req.params.productId
    );
    res
      .status(200)
      .json({ message: "Feedback fetched successfully!", allFeedback });
  } catch (err) {
    console.log(err);
  }
});

// get feedback by id
router.get("/:feedbackId", async (req, res) => {
  try {
    const feedback = await FeedbackRepo.getById(req.params.feedbackId);
    res
      .status(200)
      .json({ message: "Feedback fetched successfully!", feedback });
  } catch (err) {
    console.log(err);
  }
});

// delete feedback by id
router.delete("/:feedbackId", async (req, res) => {
  try {
    const response = await FeedbackRepo.deleteById(req.params.feedbackId);
    res
      .status(200)
      .json({ message: "Feedback deleted successfully!", response });
  } catch (err) {
    console.log(err);
  }
});

// update feedback
router.patch("/", async (req, res) => {
  try {
    const response = await FeedbackRepo.update({
      ...req.body,
      _id: req.body.id,
    });
    res
      .status(200)
      .json({ message: "Feedback updated successfully!", response });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
