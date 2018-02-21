const { buildHandlersFor } = require('./handlers');
const debug = require('debug')('ext-essentials');
const fs = require('fs');

module.exports = function(file, mutate, options, callback) {
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
    handlers.deserialize(file, buffer, (err, data) => {
      if (err) {
        callback(err, null);
        return;
      }
      debug(`Editing ${file}...`);
      try {
        data = mutate(data);
      } catch (err) {
        debug(`Error editing ${file}: ${err}`);
        callback(err, null);
        return;
      }
      handlers.serialize(file, data, (err, buffer) => {
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
    });
  });
};
