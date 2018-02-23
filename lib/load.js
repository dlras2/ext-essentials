const { buildHandlersFor } = require('./handlers');
const debug = require('debug')('ext-essentials');
const fs = require('fs');

module.exports = function(file, options, callback) {
  if (arguments.length === 2) {
    callback = options;
    options = {};
  }
  const { err, handlers } = buildHandlersFor(file, options);
  if (err) {
    return callback(err, null);
  }
  debug(`Reading ${file}...`);
  fs.readFile(file, (err, buffer) => {
    if (err) {
      debug(`Error reading ${file}: ${err}`);
      return callback(err, null);
    }
    handlers.deserialize(buffer, callback);
  });
};
