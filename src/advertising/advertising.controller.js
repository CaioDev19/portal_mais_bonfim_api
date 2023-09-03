const { ApiError } = require("../utils/apiError")
const { AdvertisingService } = require("./advertising.service")

/**
 * A advertising request object
 * @typedef {object} AdvertisingRequestPayload
 * @property {string} status
 * @property {*} file
 */

class AdvertisingController {
  /**
   * @param {AdvertisingService} advertisingService
   */
  constructor(advertisingService) {
    this.advertisingService = advertisingService
  }

  async createAdvertising(req, res) {
    try {
      const advertising =
        await this.advertisingService.createAdvertising({
          ...req.body,
          file: req.file,
        })

      return res.status(201).json(advertising)
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

  async deleteAdvertisingById(req, res) {
    const { id } = req.params

    try {
      await this.advertisingService.deleteAdvertisingById(id)

      return res.status(204).end()
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
}

module.exports = {
  AdvertisingController,
}
