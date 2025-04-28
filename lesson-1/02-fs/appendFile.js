const fs = require('node:fs/promises');

fs.appendFile('append.txt', 'I like Node.js so much\n')
  .then(() => console.log('Done'))
  .catch((err) => console.error(err));
