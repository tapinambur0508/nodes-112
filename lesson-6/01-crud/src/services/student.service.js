import { Student } from '../models/student.model.js';

export function getStudents() {
  return Student.find();
}

export function getStudentById(studentId) {
  return Student.findById(studentId); // Student.findOne({_id: studentId});
}

export function deleteStudent(studentId) {
  return Student.findByIdAndDelete(studentId);
}

export function createStudent(payload) {
  return Student.create(payload);
}

export function updateStudent(studentId, payload) {
  return Student.findByIdAndUpdate(studentId, payload, { new: true });
}

export async function replaceStudent(studentId, student) {
  const result = await Student.findByIdAndUpdate(studentId, student, {
    new: true,
    upsert: true,
    includeResultMetadata: true,
  });

  return {
    value: result.value,
    updatedExisting: result.lastErrorObject.updatedExisting,
  };
}
