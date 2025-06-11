import * as fs from 'node:fs';
import path from 'node:path';

import express from 'express';
import cookieParser from 'cookie-parser';
import swaggerUI from 'swagger-ui-express';

import routes from './routes/index.js';

import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

const SWAGGER_DOCUMENT = JSON.parse(
  fs.readFileSync(path.join('docs', 'swagger.json'), 'utf-8'),
);

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(SWAGGER_DOCUMENT));
}

app.use('/avatars', express.static(path.resolve('src', 'uploads', 'avatars')));

app.use(cookieParser());

app.use('/api', routes);

// Handler Not Found error
app.use(notFoundHandler);

// Handle Application Error
app.use(errorHandler);

export default app;
