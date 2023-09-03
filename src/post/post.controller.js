const { ApiError } = require("../utils/apiError")
const { PostService } = require("./post.service")

/**
 * A post request object
 * @typedef {object} PostRequestPayload
 * @property {string} title
 * @property {string} content
 * @property {string} summary
 * @property {number} category_id
 * @property {any} file
 */

class PostController {
  /**
   * @param {PostService} postService
   */
  constructor(postService) {
    this.postService = postService
  }

  async createPost(req, res) {
    try {
      const post = await this.postService.createPost({
        ...req.body,
        file: req.file,
      })

      return res.status(201).json(post)
    } catch (error) {
      if (error instanceof ApiError) {
        return res.status(error?.statusCode).json({
          message: error.message,
        })
      }

      return res.status(500).json({
        message: error.message,
      })
    }
  }

  async deletePostById(req, res) {
    const { id } = req.params

    try {
      await this.postService.deletePostById(id)

      res.status(204).end()
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

  async updatePostById(req, res) {
    const { id } = req.params

    try {
      await this.postService.updatePostById(id, {
        ...req.body,
        file: req.file,
      })

      res.status(204).json()
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

module.exports = {
  PostController,
}
