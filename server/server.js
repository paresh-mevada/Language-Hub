import app from './app.js';
import connectDatabase from './config/db.js';

const port = Number(process.env.PORT) || 5000;

async function startServer() {
  // connectDatabase handles all retries internally and never throws.
  // The API will start in degraded mode if MongoDB is unreachable.
  await connectDatabase();

  app.listen(port, () => {
    console.log(`[API] Language Hub listening on port ${port}`);
  });
}

startServer().catch((error) => {
  // Only truly unexpected errors (e.g. port already in use) land here.
  console.error(`[API] Fatal startup error: ${error.message}`);
  process.exit(1);
});
