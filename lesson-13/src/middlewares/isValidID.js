import createHttpError from 'http-errors';
import { isValidObjectId } from 'mongoose';

export function isValidID(req, res, next) {
  if (isValidObjectId(req.params.id) !== true) {
    return next(createHttpError.BadRequest('ID should be an ObjectId'));
  }

  next();
}
