const { Router } = require("express");
const user = require("./user/index");
const category = require("./category/index");
const product = require("./product/index");
const feedback = require("./feedback/index");

const router = Router();

router.use("/user", user);
router.use("/category", category);
router.use("/product", product);
router.use("/feedback", feedback);

module.exports = router;

