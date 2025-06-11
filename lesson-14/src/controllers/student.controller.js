import * as fs from 'node:fs/promises';
import path from 'node:path';

import createHttpError from 'http-errors';

import {
  getStudents,
  getStudentById,
  deleteStudent,
  createStudent,
  updateStudent,
  replaceStudent,
} from '../services/student.service.js';

import { getEnvVar } from '../utils/getEnvVar.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';

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
    ownerId: req.user.id,
  });

  res.json({ data: students });
}

async function getStudentByIdController(req, res) {
  const studentId = req.params.id;

  const student = await getStudentById(studentId);

  if (student === null) {
    throw new createHttpError.NotFound('Student not found');
  }

  if (student.ownerId.toString() !== req.user.id.toString()) {
    throw new createHttpError.NotFound('Student not found');
    // throw new createHttpError.Forbidden("Access denied for current student");
  }

  res.json({ status: 200, message: 'Successfully get student', data: student });
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
  let avatar = null;

  if (getEnvVar('UPLOAD_TO_CLOUDINARY') === 'true') {
    const result = await uploadToCloudinary(req.file.path);
    await fs.unlink(req.file.path);

    avatar = result.secure_url;
  } else {
    await fs.rename(
      req.file.path,
      path.resolve('src', 'uploads', 'avatars', req.file.filename),
    );

    avatar = `http://localhost:8080/avatars/${req.file.filename}`;
  }

  const student = await createStudent({
    ...req.body,
    ownerId: req.user.id,
    avatar,
  });

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
