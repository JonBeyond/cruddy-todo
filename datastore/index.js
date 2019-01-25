const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const readFileAsync = require('./counter.js').readFileAsync;
const writeFileAsync = require('./counter.js').writeFileAsync;
const unlinkAsync = require('./counter.js').unlinkAsync;
const readdirAsync = require('./counter.js').readdirAsync;

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId().then((info) => {
    let targetFile = path.join(exports.dataDir, info.text).concat('.txt');
    return writeFileAsync(targetFile, text);
  })
    .then((info) => {
      var selectId = /\d{5}/g;
      var id = info.path.match(selectId)[0];
      var text = info.text;
      callback(null, { id, text });
    });
};

exports.readAll = (callback) => {
  readdirAsync(exports.dataDir)
    .then((files) => {
      var filePromises = files.map((filename) => {
        let id = filename.replace(/.txt/gi, '');
        let targetFile = path.join(exports.dataDir, filename);
        return readFileAsync(targetFile);
      });
      var ids = files.map((filename) => {
        let id = filename.replace(/.txt/gi, '');
        return id;
      });
      Promise.all(filePromises).then((fileContents) => {
        var todos = fileContents.map((element, index) => {
          return {
            'text': element,
            'id': ids[index]
          };
        });

        callback(null, todos);
      });
      
    });
};

exports.readOne = (id, callback) => {
  //there is no reason to promisify this function
  //however, the server should be promisified, in which case an opportunity will
  //present itself to promisify this section
  let targetFile = path.join(exports.dataDir, id).concat('.txt');
  readFileAsync(targetFile)
    .then((text) => {
      callback(null, { id, text });
    });
};

exports.update = (id, newText, callback) => {
  let targetFile = path.join(exports.dataDir, id).concat('.txt');
  readFileAsync(targetFile)
    .then(() => {
      return writeFileAsync(targetFile, newText);
    })
    .then((info) => {
      callback(null, info.text);
    });
};

exports.delete = (id, callback) => {
  let targetFile = path.join(exports.dataDir, id).concat('.txt');
  unlinkAsync(targetFile).then(() => {
    callback(null);
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
