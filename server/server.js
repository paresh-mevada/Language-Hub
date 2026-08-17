import app from './app.js';
import connectDatabase from './config/db.js';

const port = Number(process.env.PORT) || 5000;

async function startServer() {
  await connectDatabase();

  app.listen(port, () => {
    console.log(`Language Hub API listening on port ${port}`);
  });
}

startServer().catch((error) => {
  console.error(`Unable to start Language Hub API: ${error.message}`);
  process.exit(1);
});
