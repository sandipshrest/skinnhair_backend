const Joi = require("joi");
const { JoiAuthBearer } = require("../helpers/validator");

const schema = {
  auth: Joi.object()
    .keys({
      authorization: JoiAuthBearer().required(),
    })
    .unknown(true),
};

module.exports = schema;
