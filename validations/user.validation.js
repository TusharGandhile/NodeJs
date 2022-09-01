const Joi= require('joi');
const passwordComplexity= require('joi-password-complexity');
const complexityOptions = {
    min: 6,
    max: 15,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 1
    
  };

const registerValidations = (data)=>{
    const schema=Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email().required(),
        password:  passwordComplexity(complexityOptions),  

    })
    return schema.validate(data);
}

const loginValidations=(data) => {
    const schema=Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
    })
    return schema.validate(data);
}
module.exports.registerValidations = registerValidations;
module.exports.loginValidations = loginValidations;
