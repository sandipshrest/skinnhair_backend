const { Router } = require("express");
const user = require("./user/index");
const category = require("./category/index");
const product = require("./product/index");
const feedback = require("./feedback/index");
const banner = require("./banner/index");
const order = require("./order/index");
const auth = require("./auth/index");
const { apiKey } = require("../auth/apikey");
const { permission } = require("../helpers/permission");

const router = Router();

/*---------------------------------------------------------*/
router.use(apiKey);
/*---------------------------------------------------------*/
/*---------------------------------------------------------*/
router.use(permission("GENERAL"));
/*---------------------------------------------------------*/

router.use("/auth", auth);
router.use("/user", user);
router.use("/category", category);
router.use("/product", product);
router.use("/feedback", feedback);
router.use("/banner", banner);
router.use("/order", order);

// Error handling middleware
router.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(err.status || 500).json({
    error: {
      message: err.message || "Internal Server Error",
    },
  });
});

module.exports = router;
