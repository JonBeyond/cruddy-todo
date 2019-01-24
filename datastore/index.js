const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    if (err) {
      console.log('error in create');
    } else {
      let targetFile = path.join(exports.dataDir, id).concat('.txt'); //yay
      //console.log('Target file is: ' + targetFile);
      fs.writeFile(targetFile, text, (err) => {
        if (err) {
          console.log("error writing file");
        } else {
          callback(null, { id, text });
        }
      });
    }
  });

};

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      console.log('error reading directory');
    } else {
      // console.log('files: ', files);
      // maps array of filenames into array of objects containing id and text
      let filez = files.map(file => {
        let replacedString = file.replace(/.txt/gi, '');
        return {id: replacedString, text: replacedString};
      });
      // console.log('filez: ', filez);
      callback(null, filez);
    }
  });
};

exports.readOne = (id, callback) => {
  //strategy: read the file,
  // err-> throw it away?
  // succ -> simply use the callback (as below)
  //         with the read info
  let targetFile = path.join(exports.dataDir, id).concat('.txt'); //yay
  fs.readFile(targetFile, 'utf8', (err, fileData) => {
    if (err){
      callback(new Error(`No item with id: ${id}`));
    } else {
      
      callback(null, { id, text: fileData });
    }
  })
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
