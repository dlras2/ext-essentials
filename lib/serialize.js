const { buildHandlersFor } = require('./handlers');

module.exports = function(file, data, options, callback) {
  if (arguments.length === 3) {
    callback = options;
    options = {};
  }
  const { err, handlers } = buildHandlersFor(file, options);
  if (err) {
    callback(err, null);
    return;
  }
  handlers.serialize(file, data, callback);
};
