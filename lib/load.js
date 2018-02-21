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
    callback(err, null);
    return;
  }
  debug(`Reading ${file}...`);
  fs.readFile(file, (err, buffer) => {
    if (err) {
      debug(`Error reading ${file}: ${err}`);
      callback(err, null);
      return;
    }
    handlers.deserialize(file, buffer, callback);
  });
};
