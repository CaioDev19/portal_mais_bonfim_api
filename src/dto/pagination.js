const { z } = require("zod")

const paginatedSchema = z
  .object({
    page: z.number().optional(),
    limit: z.number().optional(),
  })
  .optional()
  .default({
    page: 1,
    limit: 10,
  })

module.exports = { paginatedSchema }
