const express = require("express")
const {
  AdvertisingRepository,
} = require("../advertising/advertising.repository")
const {
  AdvertisingService,
} = require("../advertising/advertising.service")
const {
  AdvertisingController,
} = require("../advertising/advertising.controller")

const router = express.Router()

const advertisingRepository = new AdvertisingRepository()
const advertisingService = new AdvertisingService(
  advertisingRepository
)
const advertisingController = new AdvertisingController(
  advertisingService
)

router.get("/", advertisingController.listAdvertisings)

module.exports = router
