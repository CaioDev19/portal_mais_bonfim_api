const { prisma } = require("../config/dataBase.js")

/**
 * @typedef {object} AdvertisingCreate
 * @property {string} status
 * @property {string} imageUrl
 * @property {string} imageName
 */

class AdvertisingRepository {
  /**
   * @param {string} status
   */
  async countAdvertisingByStatus(status) {
    return prisma.advertising.aggregate({
      where: {
        status,
      },
      _count: {
        id: true,
      },
    })
  }

  /**
   * @param {AdvertisingCreate} advertising
   */
  async createAdvertising(advertising) {
    return await prisma.advertising.create({
      data: advertising,
    })
  }

  /**
   * @param {number} id
   */
  async findAdvertisingById(id) {
    return await prisma.advertising.findUnique({
      where: {
        id,
      },
    })
  }

  /**
   * @param {number} id
   */
  async deleteAdvertisingById(id) {
    return await prisma.advertising.delete({
      where: {
        id,
      },
    })
  }
}

module.exports = {
  AdvertisingRepository,
}
