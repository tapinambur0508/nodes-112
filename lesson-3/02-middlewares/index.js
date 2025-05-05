import express from 'express';

const app = express();

function middlewareA(req, res, next) {
  console.log('Middleware A');

  next();
}

function middlewareB(req, res, next) {
  console.log('Middleware B');

  next();
}

function middlewareC(req, res, next) {
  console.log('Middleware C');

  next();
}

app.use(middlewareA);
app.use(middlewareA);
app.use(middlewareB);

app.get('/', (req, res) => {
  res.json({ message: 'Hello, World!' });
});

app.get('/ping', middlewareC, middlewareA, middlewareA, (req, res) => {
  res.json({ message: 'pong' });
});

app.listen(8080, (error) => {
  if (error) {
    throw error;
  }

  console.log('Server started on port 8080');
});
