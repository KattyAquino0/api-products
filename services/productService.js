const fs = require('fs');
const path = require('path');
const { Op } = require('sequelize'); // <--- Importar operador Sequelize
const Product = require('../models/product');
require('dotenv').config();

const uploadDir = process.env.UPLOAD_DIR || 'uploads';

async function createProduct(data, files) {
  const imagenesInfo = [];

  for (const file of files) {
    const filename = file.filename;
    const url = `/${uploadDir}/${filename}`;  // ruta que el cliente puede usar
    imagenesInfo.push({ filename, url });
  }

  const payload = {
    nombre: data.nombre,
    descripcion: data.descripcion,
    caracteristicas: data.caracteristicas || [],
    categoria: data.categoria,
    sku: data.sku,
    imagenes: imagenesInfo
  };

  const prod = await Product.create(payload);
  return prod;
}

async function listProducts({ page = 1, limit = 10, filtro = {} }) {
  const offset = (page - 1) * limit;

  // Construir el "where" con filtros dinámicos:
  const where = { activo: true };

  if (filtro.categoria) {
    where.categoria = filtro.categoria;
  }

  if (filtro.nombre) {
    // Buscar con LIKE (case insensitive)
    where.nombre = { [Op.iLike]: `%${filtro.nombre}%` };
  }

  const prods = await Product.findAll({
    where,
    offset,
    limit
  });
  return prods;
}

async function getProductById(id) {
  const prod = await Product.findByPk(id);
  return prod;
}

async function updateProduct(id, data, files) {
  const prod = await getProductById(id);
  if (!prod) {
    throw new Error("Producto no encontrado");
  }

  if (files && files.length > 0) {
    // borrar imágenes antiguas del disco
    for (const img of prod.imagenes) {
      const localPath = path.join(process.cwd(), img.url.startsWith('/') ? img.url.slice(1) : img.url);
      if (fs.existsSync(localPath)) {
        try {
          fs.unlinkSync(localPath);
        } catch (err) {
          console.error("Error al eliminar imagen antigua:", err);
        }
      }
    }

    // generar las nuevas imágenes
    const newImgs = [];
    for (const file of files) {
      const filename = file.filename;
      const url = `/${uploadDir}/${filename}`;
      newImgs.push({ filename, url });
    }
    prod.imagenes = newImgs;
  }

  // actualizar campos simples
  const campos = ['nombre', 'descripcion', 'caracteristicas', 'categoria', 'sku'];
  for (const c of campos) {
    if (data[c] !== undefined) {
      prod[c] = data[c];
    }
  }

  await prod.save();
  return prod;
}

async function deleteProduct(id) {
  const prod = await getProductById(id);
  if (!prod) {
    throw new Error("Producto no encontrado");
  }

  // borrar imágenes físicas
  for (const img of prod.imagenes) {
    const localPath = path.join(process.cwd(), img.url.startsWith('/') ? img.url.slice(1) : img.url);
    if (fs.existsSync(localPath)) {
      try {
        fs.unlinkSync(localPath);
      } catch (err) {
        console.error("Error al eliminar imagen:", err);
      }
    }
  }

  // soft delete: marcar como no activo
  prod.activo = false;
  await prod.save();
  return prod;
}

module.exports = {
  createProduct,
  listProducts,
  getProductById,
  updateProduct,
  deleteProduct
};