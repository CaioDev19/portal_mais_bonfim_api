const { CategoryService } = require("./category.service")
const { ApiError } = require("../utils/apiError")

const categoryService = new CategoryService()

class CategoryController {
  async findCategories(_req, res) {
    try {
      const categories = await categoryService.findCategories()
      res.status(200).json(categories)
    } catch (error) {
      if (error instanceof ApiError) {
        return res.status(error?.statusCode).json({
          message: error.message,
        })
      }

      res.status(500).json({
        message: error.message,
      })
    }
  }
}

module.exports = { CategoryController }
