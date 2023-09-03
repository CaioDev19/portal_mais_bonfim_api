const { generateErrorMessage } = require("zod-error")

const CONFIG = {
  maxErrors: 1,
  delimiter: {
    component: " ",
  },
  path: {
    enabled: false,
  },
  code: {
    enabled: false,
  },
  message: {
    enabled: true,
    label: "",
  },
}

class ValidatorService {
  static validate(schema) {
    return async function (req, res, next) {
      try {
        await schema.parseAsync({
          body: req.body,
          query: req.query,
          params: req.params,
          file: req.file,
        })
        return next()
      } catch (error) {
        return res.status(400).json({
          // @ts-ignore
          message: generateErrorMessage(error?.issues, CONFIG),
        })
      }
    }
  }
}

module.exports = {
  ValidatorService,
}
