const { prisma } = require("../config/dataBase.js")
const prismaClient = require("@prisma/client")

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

  async countAdvertising() {
    return prisma.advertising.aggregate({
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
   * @param {string} status
   * @param {import("../utils/pagination.js").TPagination} pagination
   */
  async findAdvertisingsByStatus(pagination, status) {
    return await prisma.advertising.findMany({
      where: {
        status,
      },
      orderBy: {
        id: "desc",
      },
      take: pagination.limit,
      skip: (pagination.page - 1) * pagination.limit,
    })
  }

  /**
   * @param {import("../utils/pagination.js").TPagination} pagination
   */
  async findAdvertisings(pagination) {
    return await prisma.advertising.findMany({
      orderBy: {
        id: "desc",
      },
      take: pagination.limit,
      skip: (pagination.page - 1) * pagination.limit,
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
