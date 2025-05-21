import createHttpError from 'http-errors';

import {
  getStudents,
  getStudentById,
  deleteStudent,
  createStudent,
  updateStudent,
  replaceStudent,
} from '../services/student.service.js';

import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';

async function getStudentsController(req, res) {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);

  const students = await getStudents({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
  });

  res.json({ data: students });
}

async function getStudentByIdController(req, res) {
  const studentId = req.params.id;

  const student = await getStudentById(studentId);

  if (student === null) {
    throw new createHttpError.NotFound('Student not found');
  }

  res.json({ data: student });
}

async function deleteStudentController(req, res) {
  const studentId = req.params.id;

  const result = await deleteStudent(studentId);

  if (result === null) {
    throw new createHttpError.NotFound('Student not found');
  }

  // res
  //   .status(200)
  //   .json({
  //     status: 200,
  //     message: 'Student deleted successfully',
  //     data: result,
  //   });

  res.status(204).end();
}

async function createStudentController(req, res) {
  const student = await createStudent(req.body);

  res.status(201).json({
    status: 201,
    message: 'Student created successfully',
    data: student,
  });
}

async function updateStudentController(req, res) {
  const studentId = req.params.id;

  const result = await updateStudent(studentId, req.body);

  if (result === null) {
    throw new createHttpError.NotFound('Student not found');
  }

  res.json({
    status: 200,
    message: 'Student updated successfully',
    data: result,
  });
}

async function replaceStudentController(req, res) {
  const studentId = req.params.id;

  const { value, updatedExisting } = await replaceStudent(studentId, req.body);

  if (updatedExisting === true) {
    return res.json({
      status: 200,
      message: 'Student updated successfully',
      data: value,
    });
  }

  res.status(201).json({
    status: 201,
    message: 'Student created successfully',
    data: value,
  });
}

export {
  getStudentsController,
  getStudentByIdController,
  deleteStudentController,
  createStudentController,
  updateStudentController,
  replaceStudentController,
};
