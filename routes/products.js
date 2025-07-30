const express = require('express');
const router = express.Router();
const pool = require('../db/connection');

// GET all products
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single product by id
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CREATE new product
router.post('/', async (req, res) => {
  const { name, price, stock, category, description, image_url } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO products (name, price, stock, category, description, image_url) VALUES (?, ?, ?, ?, ?, ?)', 
      [name, price, stock, category, description, image_url]
    );
    res.status(201).json({ message: 'Product created', productId: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE product
router.put('/:id', async (req, res) => {
  const { name, price, stock, category, description, image_url } = req.body;
  try {
    const [result] = await pool.query(
      `UPDATE products SET name=?, price=?, stock=?, category=?, description=?, image_url=? WHERE id=?`, 
      [name, price, stock, category, description, image_url, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE product
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM products WHERE id=?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
