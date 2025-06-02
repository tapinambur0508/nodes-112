import 'dotenv/config';

import app from './app.js';
import { initDatabaseConnection } from './db.js';

async function bootstrap() {
  try {
    const PORT = 8080;

    await initDatabaseConnection();

    app.listen(PORT, (error) => {
      if (error) {
        throw error;
      }

      console.log(`Server started on port ${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
}

bootstrap();
