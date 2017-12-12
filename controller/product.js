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

product.buyProduct = (sId, fCallback) => {
  fs.readFile(__dirname + '/../data/products.txt', 'utf8', (err, data) => {
    if (err) {
      return fCallback(true);
    }
    // Parse data
    const ajProducts = JSON.parse(data);
    // Find a product with matching id
    let productFound = false;
    ajProducts.forEach((product, i) => {
      if (product.id === sId) {
        // if the ids match, create response object
        const jRes = {
          name: product.name
        };
        productFound = true;
        // Check if there is inventory
        if (product.inventory > 0) {
          // Reduce the inventory by one
          product.inventory--;
          // write new inventory to response
          jRes.newInventory = product.inventory;
          jRes.status = 'success';
          // and write the array back to the file
          const sajProducts = JSON.stringify(ajProducts);
          fs.writeFile(
            __dirname + '/../data/products.txt',
            sajProducts,
            err => {
              if (err) {
                return fCallback(true);
              }
              return fCallback(false, jRes);
            }
          );
        } else {
          // If there is no more inventory
          // return without errors, but with a status of 'noInventory'
          jRes.status = 'noProducts';
          return fCallback(false, jRes);
        }
      }
    });
    // If no product matched, return error
    if (!productFound) {
      return fCallback(true);
    }
  });
};

/***********************************************/

/***********************************************/

module.exports = product;
