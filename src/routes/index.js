const { Router } = require("express");
const user = require("./user/index");
const category = require("./category/index");
const product = require("./product/index");
const feedback = require("./feedback/index");
const { apiKey } = require("../auth/apikey");
const { permission } = require("../helpers/permission");

const router = Router();

/*---------------------------------------------------------*/
router.use(apiKey);
/*---------------------------------------------------------*/
/*---------------------------------------------------------*/
router.use(permission("GENERAL"));
/*---------------------------------------------------------*/

router.use("/user", user);
router.use("/category", category);
router.use("/product", product);
router.use("/feedback", feedback);

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
