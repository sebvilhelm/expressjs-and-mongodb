const fs = require('fs');
const user = {};

/***********************************************/

user.loginUser = (jUser, fCallback) => {
  fs.readFile(__dirname + '/../data/users.txt', 'utf8', (err, data) => {
    if (err) {
      return fCallback(true);
    }
    // Parse data
    const ajUsers = JSON.parse(data);
    // Find a user matching
    let userFound = false;
    ajUsers.forEach(user => {
      if (
        jUser.userEmail === user.email &&
        jUser.userPassword === user.password
      ) {
        // if the user match, delete unnessesary info, and send along with the callback
        userFound = true;
        delete user.password;
        delete user.position;
        delete user.img;
        delete user.phone;
        delete user.name;
        delete user.lastName;
        delete user.email;
        return fCallback(false, user);
      }
    });
    // Else, return error
    if (!userFound) {
      return fCallback(true);
    }
  });
};

/***********************************************/

/***********************************************/

user.getAllUsers = fCallback => {
  // Read users from users.txt
  fs.readFile(__dirname + '/../data/users.txt', 'utf8', (err, data) => {
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
  });
};

/***********************************************/

/***********************************************/

user.getUser = (sId, fCallback) => {
  fs.readFile(__dirname + '/../data/users.txt', 'utf8', (err, data) => {
    if (err) {
      return fCallback(true);
    }
    // Parse data
    const ajUsers = JSON.parse(data);
    // Find a user with matching id
    let userFound = false;
    ajUsers.forEach(user => {
      if (user.id === sId) {
        // if the ids match, send along with the callback
        userFound = true;
        return fCallback(false, user);
      }
    });
    // Else, return error
    if (!userFound) {
      return fCallback(true);
    }
  });
};

/***********************************************/

/***********************************************/

user.deleteUser = (sId, fCallback) => {
  fs.readFile(__dirname + '/../data/users.txt', 'utf8', (err, data) => {
    if (err) {
      return fCallback(true);
    }
    // Parse data
    const ajUsers = JSON.parse(data);
    // Find a user with matching id
    let userFound = false;
    ajUsers.forEach((user, i) => {
      if (user.id === sId) {
        // if the ids match, delete the user from the array
        ajUsers.splice(i, 1);
        userFound = true;
        // and write the array back to the file
        const sajUsers = JSON.stringify(ajUsers);
        fs.writeFile(__dirname + '/../data/users.txt', sajUsers, err => {
          if (err) {
            return fCallback(true);
          }
          return fCallback(false);
        });
      }
    });
    // If no user matched, return error
    if (!userFound) {
      return fCallback(true);
    }
  });
};

/***********************************************/

module.exports = user;
