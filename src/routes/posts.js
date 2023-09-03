const express = require("express")
const { PostRepository } = require("../post/post.repository")
const { PostService } = require("../post/post.service")
const {
  CategoryRepository,
} = require("../category/category.repository")
const { PostController } = require("../post/post.controller")
const router = express.Router()

const postRepository = new PostRepository()
const categoryRepository = new CategoryRepository()
const postService = new PostService(
  postRepository,
  categoryRepository
)
const postController = new PostController(postService)

router.get("/", postController.listPosts)
router.get("/:id", postController.listPostsById)

module.exports = router
