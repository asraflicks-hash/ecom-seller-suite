// api/404.js - Strict HTTP 404 Handler for Protected & Sensitive Paths
export default function handler(req, res) {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.status(404).send('404 Not Found');
}
