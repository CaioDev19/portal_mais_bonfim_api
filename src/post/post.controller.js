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

const postService = new PostService()
class PostController {
  async listPosts(req, res) {
    try {
      const { limit, page, categoryId } = req.query
      const posts = await postService.findPosts(
        {
          limit,
          page,
        },
        categoryId ? +categoryId : null
      )

      return res.status(200).json(posts)
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

  async listPostsById(req, res) {
    try {
      const { id } = req.params
      const post = await postService.findPostById(+id)
      return res.status(200).json(post)
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

  async createPost(req, res) {
    try {
      const post = await postService.createPost({
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
      await postService.deletePostById(id)

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
      await postService.updatePostById(id, {
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
