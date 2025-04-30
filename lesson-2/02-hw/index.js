import * as fs from 'node:fs/promises';

// fs.readFile('db.json', { encoding: 'utf-8' })
//   .then((data) => {
//     const contacts = JSON.parse(data);

//     console.log(
//       contacts.map((contact) => ({
//         ...contact,
//         name: contact.name.toUpperCase(),
//       })),
//     );
//   })
//   .catch((error) => console.error(error));

const contacts = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];

fs.writeFile('db.json', JSON.stringify(contacts, undefined, 2));
