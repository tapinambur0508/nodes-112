import express from 'express';

import { Student } from './models/student.js';

const app = express();

app.get('/api/students', async (req, res) => {
  const students = await Student.find();

  res.json({ data: students });
});

app.get('/api/students/:id', async (req, res) => {
  const studentId = req.params.id;

  const student = await Student.findById(studentId);

  if (student === null) {
    return res.status(404).send({ message: 'Student not found' });
  }

  res.json({ data: student });
});

export default app;
