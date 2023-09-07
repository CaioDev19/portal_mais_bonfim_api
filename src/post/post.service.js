const {
  CategoryRepository,
} = require("../category/category.repository.js")
const { FirebaseService } = require("../firebase/firebase.service.js")
const { ApiError } = require("../utils/apiError.js")
const { Pagination } = require("../utils/pagination.js")
const { PostRepository } = require("./post.repository.js")

const postRepository = new PostRepository()
const categoryRepository = new CategoryRepository()

class PostService {
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
      if (isNaN(postId)) {
        throw new ApiError("Post not found.", 404)
      }

      const post = await postRepository.findPostById(postId)

      if (!post) {
        throw new ApiError("Post not found.", 404)
      }

      return this.formatPost(post)
    } catch (error) {
      throw error
    }
  }

  /**
   * @param {import("../utils/pagination.js").TPagination} pagination
   * @param {?number} categoryId
   */
  async findPosts(pagination, categoryId) {
    let limit =
      pagination?.limit !== undefined ? +pagination.limit : 10
    let page = pagination?.page !== undefined ? +pagination.page : 1

    if (isNaN(limit)) {
      limit = 10
    }

    if (isNaN(page)) {
      page = 1
    }

    try {
      /** @type {?import("./post.repository.js").PostWithCategory[]} */
      let posts = null
      /** @type {?number} */
      let count = null

      console.log(categoryId)

      if (categoryId) {
        posts = await postRepository.findPostsPaginatedByCategoryId(
          {
            limit,
            page,
          },
          categoryId
        )

        const {
          _count: { id: totalPosts },
        } = await postRepository.countPostsByCategoryId(categoryId)

        count = totalPosts
      } else {
        posts = await postRepository.findPostsPaginated({
          limit,
          page,
        })

        const {
          _count: { id: totalPosts },
        } = await postRepository.countPosts()

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
      throw error
    }
  }

  /**
   * @param {import("./post.controller.js").PostRequestPayload} post
   */
  async createPost(post) {
    const { category_id, summary, content, title, file } = post

    try {
      const category = await categoryRepository.findCategoryById(
        +category_id
      )

      if (!category) {
        throw new ApiError("Invalid category.", 404)
      }

      file.originalname = `${file?.originalname}_${Date.now()}`
      const imageUrl = await FirebaseService.uploadImageToStorage(
        file
      )

      const post = await postRepository.createPost({
        title,
        content,
        summary,
        category_id: +category_id,
        imageName: file.originalname,
        imageUrl,
      })

      if (!post) {
        throw new Error("Error creating post.")
      }

      return this.formatPost(post)
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  /**
   * @param {string} postId
   */
  async deletePostById(postId) {
    try {
      const post = await postRepository.findPostById(+postId)

      if (!post) {
        throw new ApiError("Post not found.", 404)
      }

      await FirebaseService.deleteImageFromStorage(post.imageName)

      const deletedPost = await postRepository.deletePostById(+postId)

      if (!deletedPost) {
        throw new Error("Error deleting post.")
      }

      return
    } catch (error) {
      throw error
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

      const oldPost = await postRepository.findPostById(+postId)

      if (!oldPost) {
        throw new ApiError("Post not found.", 404)
      }

      const category = await categoryRepository.findCategoryById(
        +category_id
      )

      if (!category) {
        throw new ApiError("Invalid category.", 404)
      }

      await FirebaseService.deleteImageFromStorage(oldPost.imageName)

      file.originalname = `${file?.originalname}_${Date.now()}`
      const imageUrl = await FirebaseService.uploadImageToStorage(
        file
      )

      return await postRepository.updatePostById(+postId, {
        title,
        content,
        summary,
        category_id: +category_id,
        imageName: file.originalname,
        imageUrl,
      })
    } catch (error) {
      throw error
    }
  }
}

module.exports = {
  PostService,
}
