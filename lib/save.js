const debug = require('debug')('ext-essentials');
const fs = require('fs');
const serialize = require('./serialize');

module.exports = function(file, data, options, callback) {
  if (arguments.length === 2) {
    callback = options;
    options = {};
  }
  serialize(file, data, options, (err, buffer) => {
    if (err) {
      callback(err, null);
      return;
    }
    debug(`Writing ${file}...`);
    fs.writeFile(file, buffer, err => {
      if (err) {
        debug(`Error writing ${file}: ${err}`);
        callback(err, null);
        return;
      }
      callback(null);
    });
  });
};
