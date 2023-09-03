const { ApiError } = require("../utils/apiError")
const { AdvertisingRepository } = require("./advertising.repository")
const { FirebaseService } = require("../firebase/firebase.service")
const prismaClient = require("@prisma/client")

class AdvertisingService {
  /**
   * @param {AdvertisingRepository} advertisingRepository
   */
  constructor(advertisingRepository) {
    this.advertisingRepository = advertisingRepository
  }

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
   * @param {import("./advertising.controller").AdvertisingRequestPayload} data
   */
  async createAdvertising(data) {
    const { file, status } = data

    try {
      if (status === "Fixo") {
        const {
          _count: { id: fixedAdvertisingCount },
        } = await this.advertisingRepository.countAdvertisingByStatus(
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
        await this.advertisingRepository.createAdvertising({
          imageName: file.originalname,
          imageUrl,
          status,
        })

      if (!advertising) {
        throw new Error("Error creating advertising.")
      }

      return this.format(advertising)
    } catch (error) {
      throw error.message
    }
  }

  /**
   * @param {string} id
   */
  async deleteAdvertisingById(id) {
    try {
      const advertisingId = +id

      const advertising =
        await this.advertisingRepository.findAdvertisingById(
          advertisingId
        )

      if (!advertising) {
        throw new ApiError("Advertising not found.", 404)
      }

      await FirebaseService.deleteImageFromStorage(
        advertising.imageName
      )

      const deletedAdvertising =
        await this.advertisingRepository.deleteAdvertisingById(
          advertisingId
        )

      if (!deletedAdvertising) {
        throw new Error("Error deleting advertising.")
      }

      return
    } catch (error) {
      throw error.message
    }
  }
}

module.exports = {
  AdvertisingService,
}
