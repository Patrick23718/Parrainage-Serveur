const Joi = require("@hapi/joi");

// Register Validation
const registerValidation = (data) => {
  const schema = {
    nom: Joi.string().min(6).required(),
    niveau: Joi.number().required(),
    matricule: Joi.string().required(),
    campus: Joi.string().required(),
    filiere: Joi.string().min(24).max(24).required(),
    email: Joi.string().min(6).required().email(),
    numero: Joi.string().min(9),
    password: Joi.string().min(6).max(1024),
  };
  return Joi.validate(data, schema);
};

// Login Validation
const loginValidation = (data) => {
  const schema = {
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
  };
  return Joi.validate(data, schema);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
