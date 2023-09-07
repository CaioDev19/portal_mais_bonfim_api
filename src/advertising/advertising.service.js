const { ApiError } = require("../utils/apiError")
const { AdvertisingRepository } = require("./advertising.repository")
const { FirebaseService } = require("../firebase/firebase.service")
const prismaClient = require("@prisma/client")
const { Pagination } = require("../utils/pagination")

const advertisingRepository = new AdvertisingRepository()

class AdvertisingService {
  /**
   * @param {prismaClient.Advertising} advertising
   */
  format(advertising) {
    const { imageName, imageUrl, ...advertisingWithoutImage } =
      advertising

    return {
      ...advertisingWithoutImage,
      image: {
        name: imageName,
        url: imageUrl,
      },
    }
  }

  /**
   * @param {import("../utils/pagination").TPagination} pagination
   * @param {?string} status
   */
  async findAdvertisings(pagination, status) {
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
      /** @type {?prismaClient.Advertising[]} */
      let advertisings = null
      /** @type {?number} */
      let count = null

      if (status) {
        advertisings =
          await advertisingRepository.findAdvertisingsByStatus(
            {
              limit,
              page,
            },
            status
          )

        const {
          _count: { id: totalAdvertisings },
        } = await advertisingRepository.countAdvertisingByStatus(
          status
        )

        count = totalAdvertisings
      } else {
        advertisings = await advertisingRepository.findAdvertisings({
          limit,
          page,
        })

        const {
          _count: { id: totalAdvertisings },
        } = await advertisingRepository.countAdvertising()

        count = totalAdvertisings
      }

      const isPageValid = Pagination.isPaginationValid(count, {
        limit,
        page,
      })

      if (!isPageValid) {
        throw new ApiError("Page not found", 404)
      }

      const totalPages = Pagination.calculateTotalPages(count, limit)

      const adsFormated = advertisings?.map((ads) => this.format(ads))

      return {
        totalPages,
        currentPage: totalPages === 0 ? 0 : page,
        advertisings: adsFormated,
      }
    } catch (error) {
      throw error
    }
  }

  /**
   * @param {import("./advertising.controller").AdvertisingRequestPayload} data
   */
  async createAdvertising(data) {
    const { file, status } = data

    try {
      if (status === "Fixo") {
        const {
          _count: { id: fixedAdvertisingCount },
        } = await advertisingRepository.countAdvertisingByStatus(
          status
        )

        if (fixedAdvertisingCount === 10) {
          throw new ApiError(
            "You can't add more than 10 fixed advertising",
            400
          )
        }
      }

      file.originalname = `${file?.originalname}_${Date.now()}`
      const imageUrl = await FirebaseService.uploadImageToStorage(
        file
      )

      const advertising =
        await advertisingRepository.createAdvertising({
          imageName: file.originalname,
          imageUrl,
          status,
        })

      if (!advertising) {
        throw new Error("Error creating advertising.")
      }

      return this.format(advertising)
    } catch (error) {
      throw error
    }
  }

  /**
   * @param {string} id
   */
  async deleteAdvertisingById(id) {
    try {
      const advertisingId = +id

      const advertising =
        await advertisingRepository.findAdvertisingById(advertisingId)

      if (!advertising) {
        throw new ApiError("Advertising not found.", 404)
      }

      await FirebaseService.deleteImageFromStorage(
        advertising.imageName
      )

      const deletedAdvertising =
        await advertisingRepository.deleteAdvertisingById(
          advertisingId
        )

      if (!deletedAdvertising) {
        throw new Error("Error deleting advertising.")
      }

      return
    } catch (error) {
      throw error
    }
  }
}

module.exports = {
  AdvertisingService,
}
