const Joi = require('joi');

const schema = Joi.object({
  nombre: Joi.string().min(1).required(),
  descripcion: Joi.string().allow(''),
  caracteristicas: Joi.alternatives().try(
    Joi.array().items(Joi.string()),
    Joi.string()   // si viene como JSON string
  ).optional(),
  categoria: Joi.string().optional(),
  sku: Joi.string().optional()
});

function validateProduct(req, res, next) {
  let body = req.body;

  // si caracteristicas vino como cadena de texto JSON, parsearla
  if (body.caracteristicas && typeof body.caracteristicas === 'string') {
    try {
      body.caracteristicas = JSON.parse(body.caracteristicas);
    } catch (err) {
      return res.status(400).json({ error: "caracteristicas no es JSON válido" });
    }
  }

  const { error, value } = schema.validate(body);
  if (error) {
    return res.status(400).json({ error: error.details.map(d => d.message).join(', ') });
  }

  req.validatedBody = value;
  next();
}

module.exports = validateProduct;
