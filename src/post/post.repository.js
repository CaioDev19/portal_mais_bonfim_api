const { prisma } = require("../config/dataBase.js")
const { formatToUtcTimeZone } = require("../utils/date.js")
const prismaClient = require("@prisma/client")

/**
 * @typedef {object} PostCreate
 * @property {string} title
 * @property {string} content
 * @property {string} summary
 * @property {number} category_id
 * @property {string} imageName
 * @property {string} imageUrl
 */

/**
 * @typedef {object} Category
 * @property {prismaClient.Category} category
 *
 * @typedef {prismaClient.Post & Category} PostWithCategory
 */

class PostRepository {
  /**
   *
   * @param {PostCreate} post
   * @return {Promise<PostWithCategory>}
   */
  async createPost(post) {
    return await prisma.post.create({
      data: {
        title: post.title,
        content: post.content,
        summary: post.summary,
        category_id: Number(post.category_id),
        imageName: post.imageName,
        imageUrl: post.imageUrl,
        date: formatToUtcTimeZone(),
      },
      include: {
        category: true,
      },
    })
  }

  /**
   * @param {number} id
   * @return {Promise<PostWithCategory | null>}
   */
  async findPostById(id) {
    return await prisma.post.findUnique({
      where: {
        id: id,
      },
      include: {
        category: true,
      },
    })
  }

  /**
   * @param {number} id
   * @return {Promise<prismaClient.Post | null>}
   */
  async deletePostById(id) {
    return await prisma.post.delete({
      where: {
        id: id,
      },
    })
  }

  /**
   * @param {number} id
   * @param {PostCreate} post
   */
  async updatePostById(id, post) {
    await prisma.post.update({
      where: {
        id: id,
      },
      data: {
        title: post.title,
        content: post.content,
        summary: post.summary,
        category_id: Number(post.category_id),
        imageName: post.imageName,
        imageUrl: post.imageUrl,
      },
    })
  }

  /**
   * @param {import("../utils/pagination.js").TPagination} pagination
   * @returns {Promise<PostWithCategory[] | null>}
   */
  async findPostsPaginated(pagination) {
    return await prisma.post.findMany({
      orderBy: {
        date: "desc",
      },
      include: {
        category: true,
      },
      take: pagination.limit,
      skip: (pagination.page - 1) * pagination.limit,
    })
  }

  /**
   * @param {import("../utils/pagination.js").TPagination} pagination
   * @param {number} categoryId
   * @returns {Promise<PostWithCategory[] | null>}
   */
  async findPostsPaginatedByCategoryId(pagination, categoryId) {
    return await prisma.post.findMany({
      where: {
        category_id: categoryId,
      },
      orderBy: {
        date: "desc",
      },
      include: {
        category: true,
      },
      take: pagination.limit,
      skip: (pagination.page - 1) * pagination.limit,
    })
  }

  async countPosts() {
    return prisma.post.aggregate({
      _count: {
        id: true,
      },
    })
  }

  /**
   * @param {number} categoryId
   */
  async countPostsByCategoryId(categoryId) {
    return prisma.post.aggregate({
      where: {
        category_id: categoryId,
      },
      _count: {
        id: true,
      },
    })
  }
}

module.exports = {
  PostRepository,
}
