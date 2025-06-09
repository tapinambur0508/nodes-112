import express from 'express';

import {
  getStudentsController,
  getStudentByIdController,
  deleteStudentController,
  createStudentController,
  updateStudentController,
  replaceStudentController,
} from '../controllers/student.controller.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';

import { upload } from '../middlewares/upload.js';
import { isValidID } from '../middlewares/isValidID.js';
import { validateBody } from '../middlewares/validateBody.js';

import { studentSchema, updateStudentSchema } from '../validation/student.js';

const router = express.Router();
const jsonParser = express.json();

router.get('/', ctrlWrapper(getStudentsController));

router.get('/:id', isValidID, ctrlWrapper(getStudentByIdController));

router.delete('/:id', isValidID, ctrlWrapper(deleteStudentController));

router.post(
  '/',
  upload.single('avatar'),
  jsonParser,
  validateBody(studentSchema),
  ctrlWrapper(createStudentController),
);

router.patch(
  '/:id',
  isValidID,
  jsonParser,
  validateBody(updateStudentSchema),
  ctrlWrapper(updateStudentController),
);

router.put(
  '/:id',
  isValidID,
  jsonParser,
  validateBody(studentSchema),
  ctrlWrapper(replaceStudentController),
);

export default router;
