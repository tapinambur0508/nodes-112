import { readMovies } from './movies/movies.js';

console.log(process.cwd());

readMovies()
  .then((movies) => console.log(movies))
  .catch((err) => console.error(err));
