import { isHttpError } from 'http-errors';

export function errorHandler(error, req, res, next) {
  if (isHttpError(error) === true) {
    return res
      .status(error.status)
      .json({ status: error.status, message: error.message });
  }

  console.error('Error handler:', error);

  res.status(500).json({ status: 500, message: 'Internal Server Error' });
}
