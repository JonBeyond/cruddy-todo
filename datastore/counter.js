const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;

var counter = 0;

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
};

const readFileAsync = (path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, fileData) => {
      if (err) {
        reject(err);
      } else {
        resolve(fileData);
      }
    });
  });
};

const writeFileAsync = (path, text) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, text, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve({ path: path, text: text });
      }
    });
  });
};

const unlinkAsync = (path) => {
  return new Promise((resolve, reject) => {
    fs.unlink(path, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

const readdirAsync = (path) => {
  return new Promise((resolve, reject) => {
    fs.readdir(path, (err, files) => {
      if (err) {
        reject(err);
      } else {
        resolve(files);
      }
    });
  });
};

// Public API - Fix this function //////////////////////////////////////////////

exports.getNextUniqueId = () => {
  return readFileAsync(exports.counterFile)
    .then((fileData) => {
      let nextId = Number(fileData) + 1;
      nextId = zeroPaddedNumber(nextId);
      return writeFileAsync(exports.counterFile, nextId);
    });
};




// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, 'counter.txt'); // './counter.txt'/
exports.readFileAsync = readFileAsync;
exports.writeFileAsync = writeFileAsync;
exports.unlinkAsync = unlinkAsync;
exports.readdirAsync = readdirAsync;