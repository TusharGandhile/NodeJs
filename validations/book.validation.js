const Joi= require('joi');

const bookValidation= (data) => {
    const schema=Joi.object({
       bookName: Joi.string().required(),
       price: Joi.number().required(),
       description: Joi.string().required(),
       author: Joi.string().required(),
       photo: Joi.array()
    });
    return schema.validate(data);
}

module.exports.bookValidation= bookValidation;