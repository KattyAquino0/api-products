const productService = require('../services/productService');

async function create(req, res, next) {
  try {
    const prod = await productService.createProduct(req.validatedBody, req.files || []);
    res.status(201).json(prod);
  } catch (err) {
    next(err);
  }
}

async function list(req, res, next) {
  try {
    const { page, limit, categoria, nombre } = req.query;
    const filtro = {};
    if (categoria) filtro.categoria = categoria;
    if (nombre) {
      // Para filtrar por nombre con LIKE, hay que ajustar en servicio (sequelize)
      filtro.nombre = nombre;
    }
    const prods = await productService.listProducts({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 60,
      filtro
    });
    res.json(prods);
  } catch (err) {
    next(err);
  }
}

async function getOne(req, res, next) {
  try {
    const prod = await productService.getProductById(req.params.id);
    if (!prod) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json(prod);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const prod = await productService.updateProduct(req.params.id, req.validatedBody, req.files || []);
    res.json(prod);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const prod = await productService.deleteProduct(req.params.id);
    res.json({ mensaje: "Producto desactivado y sus imágenes eliminadas", producto: prod });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  create,
  list,
  getOne,
  update,
  remove
};