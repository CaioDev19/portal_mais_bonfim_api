const { CategoryRepository } = require("./category.repository")

const categoryRepository = new CategoryRepository()

class CategoryService {
  async findCategories() {
    try {
      return await categoryRepository.findCategories()
    } catch (error) {
      throw error
    }
  }
}

module.exports = { CategoryService }
