const fs = require('fs');
const ObjectId = require('mongodb').ObjectId;
const user = {};

/***********************************************/

/***********************************************/

user.saveUser = (jUser, fCallback) => {
  // Check if the image size is above 0
  if (jUser.userImg.size > 0) {
    // If so, define a new path and fs.rename
    const imgName = 'user-' + jUser.name + '-' + jUser.lastName + '.jpg';
    const imgPath = '/img/users/' + imgName;
    const imgPathAbsolute = __dirname + '/../public' + imgPath;
    jUser.img = imgPath;
    fs.renameSync(jUser.userImg.path, imgPathAbsolute);
  }

  delete jUser.userImg;

  global.db.collection('users').insertOne(jUser, (err, result) => {
    if (err) {
      return fCallback(true);
    }
    return fCallback(false, jUser);
  });
};

/***********************************************/

/***********************************************/

user.updateUser = (jUser, fCallback) => {
  const userId = new ObjectId(jUser.id);

  // Check if the image size is above 0
  if (jUser.userImg.size > 0) {
    // If so, define a new path and fs.rename
    const imgName = 'user-' + jUser.name + '-' + jUser.lastName + '.jpg';
    const imgPath = '/img/users/' + imgName;
    const imgPathAbsolute = __dirname + '/../public' + imgPath;
    jUser.img = imgPath;
    fs.renameSync(jUser.userImg.path, imgPathAbsolute);
  }

  delete jUser.userImg;
  delete jUser.id;

  global.db
    .collection('users')
    .updateOne({ _id: userId }, { $set: jUser }, (err, result) => {
      if (err) {
        return fCallback(true);
      }
      return fCallback(false);
    });
};

/***********************************************/

/***********************************************/

user.loginUser = (jUser, fCallback) => {
  global.db.collection('users').findOne(jUser, (err, user) => {
    if (err) {
      return fCallback(true);
    }
    delete user.password;
    delete user.position;
    delete user.img;
    delete user.phone;
    delete user.name;
    delete user.lastName;
    delete user.email;
    return fCallback(false, user);
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
      // Remove sensitive data
      data.forEach(user => {
        delete user.password;
        delete user.position;
      });

      return fCallback(false, data);
    });
};

/***********************************************/

/***********************************************/

user.getUser = (sId, fCallback) => {
  const idQuery = new ObjectId(sId);
  global.db.collection('users').findOne(idQuery, (err, data) => {
    if (err) {
      return fCallback(true);
    }
    // Remove sensitive data
    delete data.password;
    delete data.position;
    return fCallback(false, data);
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
