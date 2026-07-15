const express = require('express');
const productosRoutes = require('./routes/productos.routes');
const logger = require('./middlewares/logger');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(logger);

// Enable CORS so the React frontend (other origin/port) can call the API
app.use(cors());

app.use('/productos', productosRoutes);

// Generic error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Servidor backend-galletas escuchando en http://localhost:${PORT}`);
});
