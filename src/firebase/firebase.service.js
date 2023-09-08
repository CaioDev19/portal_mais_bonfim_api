const admin = require("firebase-admin")
const { getStorage } = require("firebase-admin/storage")
const { v4: uuidv4 } = require("uuid")

class FirebaseService {
  static app = admin.initializeApp({
    credential: admin.credential.cert({
      // @ts-ignore
      type: process.env.FIREBASE_TYPE,
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY,
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: process.env.FIREBASE_AUTH_URI,
      token_uri: process.env.FIREBASE_TOKEN_URI,
      auth_provider_x509_cert_url:
        process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
      client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
    }),
    storageBucket: process.env.FIREBASE_BUCKET_URL,
  })
  static bucket = getStorage().bucket()

  /**
   * @param {*} file
   * @returns {Promise<string>}
   */
  static async uploadImageToStorage(file) {
    const tokenId = uuidv4()
    const url = await this.createWriteStream(tokenId, file)
    return url
  }

  /**
   * @param {string} fileName
   * * @returns {Promise<void>}
   */
  static async deleteImageFromStorage(fileName) {
    const file = this.bucket.file(fileName)
    await file.delete()
  }

  /**
   * @param {string} tokenId
   * @param {*} file
   * @returns {Promise<string>}
   */
  static async createWriteStream(tokenId, file) {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject("No image file")
      }

      const fileUpload = this.bucket.file(file.originalname)

      const blobStream = fileUpload.createWriteStream({
        metadata: {
          contentType: file.mimetype,
          metadata: {
            firebaseStorageDownloadTokens: tokenId,
          },
        },
      })

      blobStream.on("error", (error) => {
        reject(error)
      })

      blobStream.on("finish", async () => {
        await fileUpload.makePublic()
        const url = `https://firebasestorage.googleapis.com/v0/b/${this.bucket.name}/o/${file.originalname}?alt=media&token=${tokenId}`

        resolve(url)
      })

      blobStream.end(file.buffer)
    })
  }
}

module.exports = {
  FirebaseService,
}
