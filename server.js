// server.js
require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3001;
const cors = require('cors');



app.use(cors());
app.use(express.json());

// Import routes
const productRoutes = require('./routes/products');
const userRoutes = require('./routes/users');
const orderRoutes = require('./routes/orders');

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);

app.get('/', (req, res) => {
  res.send('API is running');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
