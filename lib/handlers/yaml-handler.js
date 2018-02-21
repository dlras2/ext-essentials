class YamlHandler {
  constructor(options) {
    this.options = options;
  }
  deserialize(text, callback) {
    let data;
    try {
      data = require('js-yaml').safeLoad(text, this.options);
    } catch (err) {
      callback(err, null);
      return;
    }
    callback(null, data);
  }
  serialize(data, callback) {
    let text;
    try {
      text = require('js-yaml').safeDump(data, this.options);
    } catch (err) {
      callback(err, null);
      return;
    }
    callback(null, text);
  }
}

module.exports = YamlHandler;
module.exports.handles = ['yml', 'yaml'];
