class GzipHandler {
  constructor(options) {
    this.options = options;
  }
  deserialize(buffer, callback) {
    try {
      require('zlib').unzip(buffer, this.options, callback);
    } catch (err) {
      callback(err, null);
    }
  }
  serialize(buffer, callback) {
    try {
      require('zlib').gzip(buffer, this.options, callback);
    } catch (err) {
      callback(err, null);
    }
  }
}

module.exports = GzipHandler;
module.exports.handles = ['gz', 'gzip'];
