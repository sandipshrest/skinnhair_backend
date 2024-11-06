const Joi = require("joi");

const schema = {
  credential: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
  signup: Joi.object().keys({
    name: Joi.string().required().min(3),
    email: Joi.string().required().email(),
    contact: Joi.number().required(),
    password: Joi.string().required().min(6),
  }),
  feedback: Joi.object().keys({
    postedBy: Joi.string().required().id(),
    product: Joi.string().required().id(),
    feedback: Joi.string().required().min(6),
    rating: Joi.number().required(),
  }),
  category: Joi.object().keys({
    category: Joi.string().required().min(5),
  }),
  product: Joi.object().keys({
    productName: Joi.string().required().min(5),
    category: Joi.string().required().id(),
    description: Joi.string().required().min(10),
    isFeatured: Joi.boolean().required(),
    price: Joi.number().required(),
    discount: Joi.number().required(),
    importedCompany: Joi.string().required(),
    productImages: Joi.array().optional().min(1),
  }),
  banner: Joi.object().keys({
    title: Joi.string().required().min(5),
    bannerImage: Joi.string().optional().uri(),
  }),
};

module.exports = schema;
