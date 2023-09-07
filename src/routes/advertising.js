const express = require("express")
const {
  AdvertisingController,
} = require("../advertising/advertising.controller")

const router = express.Router()

const advertisingController = new AdvertisingController()

router.get("/", advertisingController.listAdvertisings)

module.exports = router
