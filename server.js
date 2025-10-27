require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');

const { sequelize, connectDB } = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
app.use(cors());
app.use(express.json());

// servir estáticos para las imágenes
const uploadDir = process.env.UPLOAD_DIR || 'uploads';
app.use(`/${uploadDir}`, express.static(path.join(__dirname, uploadDir)));

// conectar base de datos
connectDB();

// sincronizar modelos
sequelize.sync({ alter: true })
  .then(() => console.log("Modelos sincronizados en PostgreSQL"))
  .catch(err => console.error("Error sincronizando modelos:", err));

// rutas
app.use('/api/productos', productRoutes);

// error handler (debe ir al final)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor levantado en puerto ${PORT}`);
});
