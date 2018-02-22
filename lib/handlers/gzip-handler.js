let zlib; // Lazy-loaded modules

class GzipHandler {
  constructor(options) {
    zlib = zlib || require('zlib');
    this.options = options;
  }
  deserialize(buffer, callback) {
    try {
      zlib.unzip(buffer, this.options, callback);
    } catch (err) {
      callback(err, null);
    }
  }
  serialize(buffer, callback) {
    try {
      zlib.gzip(buffer, this.options, callback);
    } catch (err) {
      callback(err, null);
    }
  }
}

module.exports = GzipHandler;
module.exports.handles = ['gz', 'gzip'];
