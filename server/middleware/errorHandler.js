// Must be registered last, after every route and other middleware.
// Express identifies an error handler specifically by its 4-parameter
// signature — dropping `_req`/`_next` (even unused) would make Express
// treat this as a normal (non-error) middleware instead.
export function errorHandler(err, _req, res, _next) {
  const status = err.status ?? 500;
  console.error(err);
  res.status(status).json({ message: err.message ?? 'Internal server error' });
}
