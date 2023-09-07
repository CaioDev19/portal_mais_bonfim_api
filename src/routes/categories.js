const express = require("express")
const {
  CategoryController,
} = require("../category/category.controller")
const router = express.Router()

const categoryController = new CategoryController()

router.get("/", categoryController.findCategories)

module.exports = router
