import { readMovies } from './movies/movies.js';

readMovies()
  .then((movies) => console.log(movies))
  .catch((err) => console.error(err));
