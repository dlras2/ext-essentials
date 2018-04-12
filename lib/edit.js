const { buildHandlersFor } = require('./handlers');
const debug = require('debug')('ext-essentials');
const fs = require('fs');

module.exports = function(file, mutator, options, callback) {
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
    handlers.deserialize(buffer, (err, data) => {
      if (err) {
        return callback(err, null);
      }
      debug(`Editing ${file}...`);
      try {
        data = mutator(data);
      } catch (err) {
        debug(`Error editing ${file}: ${err}`);
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
    });
  });
};
