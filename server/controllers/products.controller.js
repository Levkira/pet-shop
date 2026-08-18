import { products } from '../data.js';

export function getProducts(_req, res) {
  res.json(products);
}

export function getProductById(req, res, next) {
  const product = products.find((p) => p.id === req.params.id);
  if (!product) {
    const error = new Error(`Product ${req.params.id} not found`);
    error.status = 404;
    next(error);
    return;
  }
  res.json(product);
}
