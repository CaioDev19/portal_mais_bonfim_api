const express = require("express")
const upload = require("../config/multer.js")
const {
  ValidatorService,
} = require("../validator/validator.service.js")
const { PostController } = require("../post/post.controller.js")
const { Auth } = require("../middlewares/auth.js")
const { PostSchema } = require("../dto/post.js")
const { AdvertisingSchema } = require("../dto/advertising.js")
const {
  AdvertisingController,
} = require("../advertising/advertising.controller.js")

const router = express.Router()

const postController = new PostController()
const advertisingController = new AdvertisingController()

router.use(Auth)

router.post(
  "/post",
  upload.single("image"),
  ValidatorService.validate(PostSchema),
  postController.createPost
)
router.delete("/post/:id", postController.deletePostById)
router.put(
  "/post/:id",
  upload.single("image"),
  ValidatorService.validate(PostSchema),
  postController.updatePostById
)

router.post(
  "/advertising",
  upload.single("image"),
  ValidatorService.validate(AdvertisingSchema),
  advertisingController.createAdvertising
)
router.delete(
  "/advertising/:id",
  advertisingController.deleteAdvertisingById
)

module.exports = router
