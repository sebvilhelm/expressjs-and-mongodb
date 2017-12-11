const fs = require('fs');
const user = {};

/***********************************************/

/***********************************************/

user.saveUser = (jUserInfo, fCallback) => {
  const jUser = {
    name: jUserInfo.userName,
    lastName: jUserInfo.userLastName,
    password: jUserInfo.userPassword,
    email: jUserInfo.userEmail,
    phone: jUserInfo.userPhone,
    position: jUserInfo.userPosition,
    isAdmin: true
  };

  // Check if the image size is above 0
  if (jUserInfo.userImg.size > 0) {
    // If so, define a new path and fs.rename
    const imgName = 'user-' + jUser.name + '-' + jUser.lastName + '.jpg';
    const imgPath = '/img/users/' + imgName;
    const imgPathAbsolute = __dirname + '/../public' + imgPath;
    jUser.img = imgPath;
    fs.renameSync(jUserInfo.userImg.path, imgPathAbsolute);
  }

  global.db.collection('users').insertOne(jUser, (err, result) => {
    if (err) {
      return fCallback(true);
    }
    return fCallback(false, jUser);
  });
};

/***********************************************/

/***********************************************/

user.updateUser = (jUserInfo, fCallback) => {
  const jUser = {
    id: jUserInfo.id,
    name: jUserInfo.userName,
    lastName: jUserInfo.userLastName,
    password: jUserInfo.userPassword,
    email: jUserInfo.userEmail,
    phone: jUserInfo.userPhone,
    position: jUserInfo.userPosition
  };
  jUser.isAdmin = jUserInfo.userIsAdmin ? true : false;

  // Check if the image size is above 0
  if (jUserInfo.userImg.size > 0) {
    // If so, define a new path and fs.rename
    const imgName = 'user-' + userId + '.jpg';
    const imgPath = '/img/users/' + imgName;
    const imgPathAbsolute = __dirname + '/../public' + imgPath;
    jUser.img = imgPath;
    fs.renameSync(jUserInfo.userImg.path, imgPathAbsolute);
  }

  const ajUsers = [jUser];

  const sajUsers = JSON.stringify(ajUsers);
  fs.writeFile(__dirname + '/../data/users.txt', sajUsers, err => {
    if (err) {
      return fCallback(true);
    }
    return fCallback(false);
  });
};

/***********************************************/

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
  global.db
    .collection('users')
    .find()
    .toArray((err, data) => {
      if (err) {
        return fCallback(true);
      }
      // Parse data
      console.log(data);

      data.forEach(user => {
        delete user.password;
        delete user.position;
      });

      return fCallback(false, data);
      /* const ajUsers = JSON.parse(data);
      // Remove sensitive data
      ajUsers.forEach(user => {
        delete user.password;
        delete user.position;
      });
      // Parse send data as array
      return fCallback(false, ajUsers); */
    });
  // Read users from users.txt
  /* fs.readFile(__dirname + '/../data/users.txt', 'utf8', (err, data) => {
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
  }); */
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

/***********************************************/

module.exports = user;
