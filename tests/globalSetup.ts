import { createApp } from '../server/app.js';

export default async function setup() {
  const app = createApp();
  const server = app.listen(4000);

  return () =>
    new Promise<void>((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });
}
