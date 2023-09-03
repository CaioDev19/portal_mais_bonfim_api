const {
  CategoryRepository,
} = require("../category/category.repository.js")
const { FirebaseService } = require("../firebase/firebase.service.js")
const { ApiError } = require("../utils/apiError.js")
const { Pagination } = require("../utils/pagination.js")
const { PostRepository } = require("./post.repository.js")

class PostService {
  /**
   * @param {PostRepository} postRepository
   * @param {CategoryRepository} categoryRepository
   */
  constructor(postRepository, categoryRepository) {
    this.postRepository = postRepository
    this.categoryRepository = categoryRepository
  }

  /**
   * @param {import("./post.repository.js").PostWithCategory} post
   */
  formatPost(post) {
    const {
      imageName,
      imageUrl: image_url,
      category_id: category,
      ...postWithoutImage
    } = post

    return {
      ...postWithoutImage,
      image: {
        name: imageName,
        url: image_url,
      },
    }
  }

  /**
   * @param {number} postId
   */
  async findPostById(postId) {
    try {
      const post = await this.postRepository.findPostById(postId)

      if (!post) {
        throw new ApiError("Post not found.", 404)
      }

      return this.formatPost(post)
    } catch (error) {
      throw error.message
    }
  }

  /**
   * @param {import("../utils/pagination.js").TPagination} pagination
   * @param {?number} categoryId
   */
  async findPosts(pagination, categoryId) {
    const { limit = 10, page = 1 } = pagination

    try {
      /** @type {?import("./post.repository.js").PostWithCategory[]} */
      let posts = null
      /** @type {?number} */
      let count = null

      if (categoryId) {
        posts =
          await this.postRepository.findPostsPaginatedByCategoryId(
            {
              limit,
              page,
            },
            categoryId
          )

        const {
          _count: { id: totalPosts },
        } = await this.postRepository.countPostsByCategoryId(
          categoryId
        )

        count = totalPosts
      } else {
        posts = await this.postRepository.findPostsPaginated({
          limit,
          page,
        })

        const {
          _count: { id: totalPosts },
        } = await this.postRepository.countPosts()

        count = totalPosts
      }

      const isPageValid = Pagination.isPaginationValid(count, {
        limit,
        page,
      })

      if (!isPageValid) {
        throw new ApiError("Page not found", 404)
      }

      const totalPages = Pagination.calculateTotalPages(count, limit)

      const formatedPosts = posts?.map((post) =>
        this.formatPost(post)
      )

      return {
        totalPages,
        currentPage: totalPages === 0 ? 0 : page,
        posts: formatedPosts,
      }
    } catch (error) {
      throw error.message
    }
  }

  /**
   * @param {import("./post.controller.js").PostRequestPayload} post
   */
  async createPost(post) {
    const { category_id, summary, content, title, file } = post

    try {
      const category = await this.categoryRepository.findCategoryById(
        category_id
      )

      if (!category) {
        throw new ApiError("Invalid category.", 404)
      }

      file.originalname = `${file?.originalname}_${Date.now()}`
      const imageUrl = await FirebaseService.uploadImageToStorage(
        file
      )

      const post = await this.postRepository.createPost({
        title,
        content,
        summary,
        category_id,
        imageName: file.originalname,
        imageUrl,
      })

      if (!post) {
        throw new Error("Error creating post.")
      }

      return this.formatPost(post)
    } catch (error) {
      throw error.message
    }
  }

  /**
   * @param {string} postId
   */
  async deletePostById(postId) {
    try {
      const post = await this.postRepository.findPostById(+postId)

      if (!post) {
        throw new ApiError("Post not found.", 404)
      }

      await FirebaseService.deleteImageFromStorage(post.imageName)

      const deletedPost = await this.postRepository.deletePostById(
        +postId
      )

      if (!deletedPost) {
        throw new Error("Error deleting post.")
      }

      return
    } catch (error) {
      throw error.message
    }
  }

  /**
   * @param {string} postId
   * @param {import("./post.controller.js").PostRequestPayload} newPost
   * @returns
   */
  async updatePostById(postId, newPost) {
    try {
      const { category_id, summary, content, title, file } = newPost

      const oldPost = await this.postRepository.findPostById(+postId)

      if (!oldPost) {
        throw new ApiError("Post not found.", 404)
      }

      const category = await this.categoryRepository.findCategoryById(
        category_id
      )

      if (!category) {
        throw new ApiError("Invalid category.", 404)
      }

      await FirebaseService.deleteImageFromStorage(oldPost.imageName)

      file.originalname = `${file?.originalname}_${Date.now()}`
      const imageUrl = await FirebaseService.uploadImageToStorage(
        file
      )

      return await this.postRepository.updatePostById(+postId, {
        title,
        content,
        summary,
        category_id,
        imageName: file.originalname,
        imageUrl,
      })
    } catch (error) {
      throw error.message
    }
  }
}

module.exports = {
  PostService,
}
