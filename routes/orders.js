const express = require('express');
const router = express.Router();
const pool = require('../db/connection');

// GET all orders
router.get('/', async (req, res) => {
  try {
    const [orders] = await pool.query('SELECT * FROM orders');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET order by id with items
router.get('/:id', async (req, res) => {
  try {
    const [orders] = await pool.query('SELECT * FROM orders WHERE id = ?', [req.params.id]);
    if (orders.length === 0) return res.status(404).json({ error: 'Order not found' });

    const order = orders[0];
    const [items] = await pool.query(
      `SELECT oi.id, oi.quantity, p.id as product_id, p.name, p.price 
       FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?`, 
      [order.id]
    );

    order.items = items;
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CREATE new order with order items
router.post('/', async (req, res) => {
  const { user_id, status, items } = req.body;
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Order must have at least one item' });
  }

  try {
    // Hitung total price
    let totalPrice = 0;
    for (const item of items) {
      const [products] = await pool.query('SELECT price FROM products WHERE id = ?', [item.product_id]);
      if (products.length === 0) return res.status(400).json({ error: `Product with id ${item.product_id} not found` });
      totalPrice += products[0].price * item.quantity;
    }

    // Insert order
    const [resultOrder] = await pool.query(
      'INSERT INTO orders (user_id, total_price, status) VALUES (?, ?, ?)', 
      [user_id, totalPrice, status || 'pending']
    );

    const orderId = resultOrder.insertId;

    // Insert order items
    const itemPromises = items.map(item => {
      return pool.query('INSERT INTO order_items (order_id, product_id, quantity) VALUES (?, ?, ?)', 
        [orderId, item.product_id, item.quantity]);
    });

    await Promise.all(itemPromises);

    res.status(201).json({ message: 'Order created', orderId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE order status
router.put('/:id/status', async (req, res) => {
  const { status } = req.body;
  try {
    const [result] = await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Order not found' });
    res.json({ message: 'Order status updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE order (and order items)
router.delete('/:id', async (req, res) => {
  try {
    const orderId = req.params.id;
    await pool.query('DELETE FROM order_items WHERE order_id = ?', [orderId]);
    const [result] = await pool.query('DELETE FROM orders WHERE id = ?', [orderId]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Order not found' });
    res.json({ message: 'Order deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
