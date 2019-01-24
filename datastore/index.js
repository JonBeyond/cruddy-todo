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

exports.update = (id, newText, callback) => {
  //check that the file exists
  //-> if that responds with err, then it doesnt (stop, throw away EVERYHITNG)
  //-> if it is the succ callback, then we continue
  let targetFile = path.join(exports.dataDir, id).concat('.txt'); //yay

  fs.readFile(targetFile, 'utf8', (err, fileData) => {
    if (err) {
      console.log('todo requested does not exist');
      callback(new Error('todo requested does not exist'), null);
    } else {
      fs.writeFile(targetFile, newText, (err) => {
        if (err) {
          console.log('file exists; but write failed');
          callback(new Error('file exists; but write failed'), null);
        } else {
          callback(null, newText);
        }
      })
    }
  });
};

exports.delete = (id, callback) => {
  let targetFile = path.join(exports.dataDir, id).concat('.txt'); //yay
  fs.unlink(targetFile, (err) => {
    if (err) {
      console.log('todo delete failed');
      callback(new Error('todo delete failed'));
    } else {
      callback(null);
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
