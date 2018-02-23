const { buildHandlersFor } = require('./handlers');

module.exports = function(file, buffer, options, callback) {
  if (arguments.length === 3) {
    callback = options;
    options = {};
  }
  const { err, handlers } = buildHandlersFor(file, options);
  if (err) {
    return callback(err, null);
  }
  handlers.deserialize(buffer, callback);
};
