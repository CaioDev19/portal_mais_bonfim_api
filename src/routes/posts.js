const express = require("express")
const { PostController } = require("../post/post.controller")
const router = express.Router()

const postController = new PostController()

router.get("/", postController.listPosts)
router.get("/:id", postController.listPostsById)

module.exports = router
