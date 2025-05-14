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

const router = express.Router();
const jsonParser = express.json();

router.get('/', ctrlWrapper(getStudentsController));

router.get('/:id', ctrlWrapper(getStudentByIdController));

router.delete('/:id', ctrlWrapper(deleteStudentController));

router.post('/', jsonParser, ctrlWrapper(createStudentController));

router.patch('/:id', jsonParser, ctrlWrapper(updateStudentController));

router.put('/:id', jsonParser, ctrlWrapper(replaceStudentController));

export default router;
