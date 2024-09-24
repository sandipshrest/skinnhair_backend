const { Router } = require("express");
const user = require("./user/index")
const category = require("./category/index")

const router = Router()

router.use('/user', user)
router.use('/category', category)

module.exports = router