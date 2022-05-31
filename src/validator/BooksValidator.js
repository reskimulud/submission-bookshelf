const Joi = require('joi');
const ClientError = require('../exceptions/ClientError');

class BooksValidator {
  #errName;

  #schema() {
    return Joi.object({
      name: Joi
          .string()
          .required()
          .messages({
            'any.required': `Gagal ${this.#errName} buku. Mohon isi nama buku`,
          }),
      year: Joi.number().min(0).max(9999),
      author: Joi.string(),
      summary: Joi.string(),
      publisher: Joi.string(),
      pageCount: Joi.number(),
      readPage: Joi
          .number()
          .max(Joi.ref('pageCount'))
      // eslint-disable-next-line max-len
          .message(`Gagal ${this.#errName} buku. readPage tidak boleh lebih besar dari pageCount`),
      finished: Joi.boolean(),
      reading: Joi.boolean(),
    });
  }

  validateBooksPayload(payload, errName) {
    this.#errName = errName;

    const validateResult = this.#schema().validate(payload);
    if (validateResult.error) {
      throw new ClientError(validateResult.error.message);
    }
  }
};

module.exports = BooksValidator;
