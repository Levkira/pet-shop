import { createApp } from './app.js';

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

const app = createApp();

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Pet Shop Express backend is listening on http://localhost:${PORT}`);
});
