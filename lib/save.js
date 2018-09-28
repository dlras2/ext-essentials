const { buildHandlersFor } = require('./handlers');
const debug = require('debug')('ext-essentials');
const fs = require('fs');

module.exports = function(file, data, options, callback) {
  if (arguments.length === 3) {
    callback = options;
    options = {};
  }
  const { err, handlers } = buildHandlersFor(file, options);
  if (err) {
    return callback(err, null);
  }
  handlers.serialize(data, (err, buffer) => {
    if (err) {
      return callback(err, null);
    }
    debug(`Writing ${file}...`);
    fs.writeFile(file, buffer, err => {
      if (err) {
        debug(`Error writing ${file}: ${err}`);
        return callback(err, null);
      }
      callback(null);
    });
  });
};
