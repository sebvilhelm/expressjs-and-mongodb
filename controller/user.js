const fs = require('fs');
const user = {};

user.getAllUsers = fCallback => {
  // Read users from users.txt
  const data = fs.readFile(
    __dirname + '/../data/users.txt',
    'utf8',
    (err, data) => {
      if (err) {
        return fCallback(true);
      }
      // Parse data
      const ajUsers = JSON.parse(data);
      // Remove sensitive data
      ajUsers.forEach(user => {
        delete user.password;
        delete user.position;
      });
      // Parse send data as array
      return fCallback(false, ajUsers);
    }
  );
};

user.getUser = (sId, fCallback) => {
  const data = fs.readFile(
    __dirname + '/../data/users.txt',
    'utf8',
    (err, data) => {
      if (err) {
        return fCallback(true);
      }
      // Parse data
      const ajUsers = JSON.parse(data);
      // Find a user with matching id
      ajUsers.forEach(user => {
        if (user.id === sId) {
          // if the ids match, send along with the callback
          return fCallback(false, user);
        }
      });
      // Else, return error
      return fCallback(true);
    }
  );
};

module.exports = user;
