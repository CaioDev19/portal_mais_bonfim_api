const { CategoryRepository } = require("./category.repository")

class CategoryService {
  /**
   * @param {CategoryRepository} categoryRepository
   */
  constructor(categoryRepository) {
    this.categoryRepository = categoryRepository
  }

  async findCategories() {
    try {
      return await this.categoryRepository.findCategories()
    } catch (error) {
      throw error.message
    }
  }
}

module.exports = { CategoryService }
