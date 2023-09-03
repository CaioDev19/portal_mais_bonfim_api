const express = require("express")
const {
  CategoryRepository,
} = require("../category/category.repository")
const { CategoryService } = require("../category/category.service")
const {
  CategoryController,
} = require("../category/category.controller")
const router = express.Router()

const categoryRepository = new CategoryRepository()
const categoryService = new CategoryService(categoryRepository)
const categoryController = new CategoryController(categoryService)

router.get("/", categoryController.findCategories)

module.exports = router
