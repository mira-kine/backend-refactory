const { Router } = require('express');
const { updateById, deleteById } = require('../models/Order');
const Order = require('../models/Order');
const pool = require('../utils/pool');

module.exports = Router()
  .post('/', async (req, res) => {
    try {
      const order = await Order.insert({
        product: req.body.product,
        quantity: req.body.quantity,
      });
      res.json(order);
    } catch (error) {
      return null;
    }
  })

  .get('/:id', async (req, res) => {
    try {
      const order = await Order.getById(req.params.id);
      res.json(order);
    } catch (error) {
      return null;
    }
  })

  .get('/', async (req, res, next) => {
    try {
      const orders = await Order.getAll();
      res.json(orders);
    } catch (error) {
      error.status = 404;
      next(error);
    }
  })

  .patch('/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      const results = await pool.query(
        `
      SELECT * FROM orders WHERE id=$1
      `,
        [id]
      );
      const existingOrder = results.rows[0];
      // const result = await pool.query(
      //   `
      //   SELECT * FROM orders WHERE id=$1;
      //   `,
      //   [id]
      // );
      // const existingOrder = result.rows[0];

      const order = await updateById(id);
      if (!existingOrder) {
        const error = new Error(`Order ${id} not found`);
        error.status = 404;
        throw error;
      }
      // const product = req.body.product ?? existingOrder.product;
      // const quantity = req.body.quantity ?? existingOrder.quantity;
      // const { rows } = await pool.query(
      //   'UPDATE orders SET product=$2, quantity=$3 WHERE id=$1 RETURNING *;',
      //   [id, product, quantity]
      // );
      // const order = new Order(rows[0]);

      res.json(order);
    } catch (error) {
      next(error);
    }
  })

  .delete('/:id', async (req, res) => {
    try {
      const order = await deleteById(req.params.id);
      res.json(order);
    } catch (error) {
      return null;
    }
  });
