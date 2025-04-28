const fs = require('node:fs/promises');

fs.writeFile('write.txt', 'Node.js is awesome platform:)')
  .then(() => console.log('Done'))
  .catch((err) => console.error(err));
