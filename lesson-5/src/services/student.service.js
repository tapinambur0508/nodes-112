import { Student } from '../models/student.model.js';

export function getStudents() {
  return Student.find();
}

export function getStudentById(studentId) {
  return Student.findById(studentId);
}
