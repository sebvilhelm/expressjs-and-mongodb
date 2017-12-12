const fs = require('fs');
const ObjectId = require('mongodb').ObjectId;
const util = require('../util');

const product = {};

/***********************************************/

/***********************************************/

product.saveProduct = (jProduct, fCallback) => {
  // Check if the image size is above 0
  if (jProduct.productImg.size > 0) {
    const imgId = util.createId();
    // If so, define a new path and fs.rename
    const imgName = 'product-' + imgId + '.jpg';
    const imgPath = '/img/products/' + imgName;
    const imgPathAbsolute = __dirname + '/../public' + imgPath;
    jProduct.img = imgPath;
    fs.renameSync(jProduct.productImg.path, imgPathAbsolute);
  }

  delete jProduct.productImg;

  global.db.collection('products').insertOne(jProduct, (err, result) => {
    if (err) {
      return fCallback(true);
    }
    jProduct._id = result.insertedId;
    return fCallback(false, jProduct);
  });
};

/***********************************************/

/***********************************************/

product.updateProduct = (jProduct, fCallback) => {
  const productId = new ObjectId(jProduct.id);
  // Check if the image size is above 0
  if (jProduct.productImg.size > 0) {
    const imgId = util.createId();
    // If so, define a new path and fs.rename
    const imgName = 'product-' + imgId + '.jpg';
    const imgPath = '/img/products/' + imgName;
    const imgPathAbsolute = __dirname + '/../public' + imgPath;
    jProduct.img = imgPath;
    fs.renameSync(jProduct.productImg.path, imgPathAbsolute);
  }

  delete jProduct.productImg;
  delete jProduct.id;

  global.db
    .collection('products')
    .updateOne({ _id: productId }, { $set: jProduct }, (err, result) => {
      if (err) {
        return fCallback(true);
      }
      return fCallback(false);
    });
};

/***********************************************/

/***********************************************/

product.getAllProducts = fCallback => {
  global.db
    .collection('products')
    .find()
    .toArray((err, data) => {
      if (err) {
        return fCallback(true);
      }
      return fCallback(false, data);
    });
};

/***********************************************/

/***********************************************/

product.getProduct = (sId, fCallback) => {
  const idQuery = new ObjectId(sId);
  global.db.collection('products').findOne(idQuery, (err, data) => {
    if (err) {
      return fCallback(true);
    }
    return fCallback(false, data);
  });
};

/***********************************************/

/***********************************************/

product.deleteProduct = (sId, fCallback) => {
  const idQuery = new ObjectId(sId);
  global.db
    .collection('products')
    .deleteOne({ _id: idQuery }, (err, result) => {
      if (err) {
        return fCallback(true);
      }
      return fCallback(false);
    });
};

/***********************************************/

/***********************************************/

product.buyProduct = (jOrder, fCallback) => {
  global.db.collection('orders').insertOne(jOrder, err => {
    if (err) {
      return fCallback(true);
    }
    fCallback(false);
  });
};

/***********************************************/

/***********************************************/

module.exports = product;
