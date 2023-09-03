const express = require("express")
const adminRouter = require("./admin.js")
const categoryRouter = require("./categories.js")
const postRouter = require("./posts.js")
const advertisingRouter = require("./advertising.js")

const router = express.Router()

router.use("/admin", adminRouter)
router.use("/category", categoryRouter)
router.use("/post", postRouter)
router.use("/advertising", advertisingRouter)

module.exports = router
