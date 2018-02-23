let zlib; // Lazy-loaded modules

class GzipHandler {
  constructor(options) {
    loadModules();
    this.options = options;
  }
  deserialize(buffer, callback) {
    try {
      zlib.unzip(buffer, this.options, callback);
    } catch (err) {
      // Bad options throw an exception, rather than calling the callback
      callback(err, null);
    }
  }
  serialize(buffer, callback) {
    try {
      zlib.gzip(buffer, this.options, callback);
    } catch (err) {
      // Bad options throw an exception, rather than calling the callback
      callback(err, null);
    }
  }
}

function loadModules() {
  if (zlib === undefined) {
    zlib = require('zlib');
  }
}

module.exports = GzipHandler;
module.exports.handles = ['gz', 'gzip'];
