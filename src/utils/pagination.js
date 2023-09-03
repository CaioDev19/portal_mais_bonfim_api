/**
 * @typedef {object} TPagination
 * @property {number} page
 * @property {number} limit
 */

class Pagination {
  /**
   * @param {number} count
   * @param {number} limit
   * @returns {number}
   */
  static calculateTotalPages(count, limit) {
    return Math.ceil(count / limit)
  }

  /**
   * @param {number} count
   * @param {TPagination} pagination
   */
  static isPaginationValid(count, pagination) {
    const totalPages = this.calculateTotalPages(
      count,
      pagination.limit
    )

    if (
      (totalPages > 0 && pagination.page > totalPages) ||
      pagination.page < 1
    ) {
      return false
    }

    return true
  }
}

module.exports = { Pagination }
