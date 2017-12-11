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
    jUser._id = result.insertedId;
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
    return fCallback(false, data);
  });
};

/***********************************************/

/***********************************************/

user.deleteUser = (sId, fCallback) => {
  const idQuery = new ObjectId(sId);

  global.db.collection('users').deleteOne({ _id: idQuery }, (err, result) => {
    if (err) {
      return fCallback(true);
    }
    return fCallback(false);
  });
};

/***********************************************/

/***********************************************/

module.exports = user;
