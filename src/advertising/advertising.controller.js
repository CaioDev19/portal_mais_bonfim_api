const { ApiError } = require("../utils/apiError")
const { AdvertisingService } = require("./advertising.service")

/**
 * A advertising request object
 * @typedef {object} AdvertisingRequestPayload
 * @property {string} status
 * @property {*} file
 */

const advertisingService = new AdvertisingService()

class AdvertisingController {
  async listAdvertisings(req, res) {
    try {
      const { limit, page, status } = req.query
      const advertisings = await advertisingService.findAdvertisings(
        {
          limit,
          page,
        },
        status ? status : null
      )

      return res.status(200).json(advertisings)
    } catch (error) {
      if (error instanceof ApiError) {
        return res.status(error?.statusCode).json({
          message: error.message,
        })
      }

      return res.status(500).json({
        message: error,
      })
    }
  }

  async createAdvertising(req, res) {
    try {
      const advertising = await advertisingService.createAdvertising({
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
      await advertisingService.deleteAdvertisingById(id)

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
