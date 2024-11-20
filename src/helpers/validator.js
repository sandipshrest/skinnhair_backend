const Joi = require("joi");

const JoiAuthBearer = () =>
  Joi.string().custom((value, helpers) => {
    if (!value.startsWith("Bearer ")) return helpers.error("any.invalid");
    if (!value.split(" ")[1]) return helpers.error("any.invalid");
    return value;
  }, "Authorization Header Validation");

const validator =
  (schema, source = "body") =>
  (req, res, next) => {
    try {
      const { error } = schema.validate(req[source]);

      if (!error) return next();

      const { details } = error;
      const message = details
        .map((i) => i.message.replace(/['"]+/g, ""))
        .join(",");

      return res.status(422).json({ error: message });
    } catch (error) {
      next(error);
    }
  };

module.exports = { validator, JoiAuthBearer };
