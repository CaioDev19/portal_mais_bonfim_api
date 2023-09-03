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
}

module.exports = {
  PostRepository,
}
