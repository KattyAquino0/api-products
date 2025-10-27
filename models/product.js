const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT
  },
  caracteristicas: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  imagenes: {
    type: DataTypes.JSONB,
    defaultValue: []  // array de objetos { filename, url }
  },
  categoria: {
    type: DataTypes.STRING
  },
  sku: {
    type: DataTypes.STRING,
    unique: true
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'productos',
  timestamps: true,
  createdAt: 'creadoEn',
  updatedAt: 'modificadoEn'
});

module.exports = Product;