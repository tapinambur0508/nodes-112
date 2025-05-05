import cors from 'cors';
import express from 'express';

const app = express();

app.use(
  cors({
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
  }),
);

app.get('/', (req, res) => {
  res.json({ message: 'Hello, World' });
});

app.listen(8080, (error) => {
  if (error) {
    throw error;
  }

  console.log('Server started on port 8080');
});
