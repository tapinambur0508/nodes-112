import mongoose from 'mongoose';

import { getEnvVar } from './utils/getEnvVar.js';

function initDatabaseConnection() {
  return mongoose.connect(getEnvVar('MONGODB_URI'));
}

export { initDatabaseConnection };
