const express = require("express")
const upload = require("../config/multer.js")
const {
  ValidatorService,
} = require("../validator/validator.service.js")
const { PostController } = require("../post/post.controller.js")
const { Auth } = require("../middlewares/auth.js")
const { PostService } = require("../post/post.service.js")
const { PostRepository } = require("../post/post.repository.js")
const {
  CategoryRepository,
} = require("../category/category.repository.js")
const { PostSchema } = require("../dto/post.js")
const { AdvertisingSchema } = require("../dto/advertising.js")
const {
  AdvertisingRepository,
} = require("../advertising/advertising.repository.js")
const {
  AdvertisingService,
} = require("../advertising/advertising.service.js")
const {
  AdvertisingController,
} = require("../advertising/advertising.controller.js")

const router = express.Router()
const postRepository = new PostRepository()
const categoryRepository = new CategoryRepository()
const postService = new PostService(
  postRepository,
  categoryRepository
)
const postController = new PostController(postService)

const advertisingRepository = new AdvertisingRepository()
const advertisingService = new AdvertisingService(
  advertisingRepository
)
const advertisingController = new AdvertisingController(
  advertisingService
)

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
router.post(
  "/advertising/:id",
  advertisingController.deleteAdvertisingById
)

module.exports = router