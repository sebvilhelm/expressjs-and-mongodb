const fs = require('fs');
const user = {};

user.getAllUsers = fCallback => {
  // Read users from users.txt
  const data = fs.readFile(
    __dirname + '/../data/users.txt',
    'utf8',
    (err, data) => {
      const ajUsers = JSON.parse(data);
      fCallback(ajUsers);
    }
  );
};

module.exports = user;
