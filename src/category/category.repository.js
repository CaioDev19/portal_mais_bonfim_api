const { prisma } = require("../config/dataBase.js")
const prismaClient = require("@prisma/client")

class CategoryRepository {
  /**
   * @param {number} id
   * @returns {Promise<prismaClient.Category | null>}
   */
  async findCategoryById(id) {
    return await prisma.category.findUnique({
      where: {
        id,
      },
    })
  }
}

module.exports = {
  CategoryRepository,
}
