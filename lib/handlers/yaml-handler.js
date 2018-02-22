let jsYaml; // Lazy-loaded modules

class YamlHandler {
  constructor(options) {
    jsYaml = jsYaml || require('js-yaml');
    this.options = options;
  }
  deserialize(text, callback) {
    let data;
    try {
      data = jsYaml.safeLoad(text, this.options);
    } catch (err) {
      callback(err, null);
      return;
    }
    callback(null, data);
  }
  serialize(data, callback) {
    let text;
    try {
      text = jsYaml.safeDump(data, this.options);
    } catch (err) {
      callback(err, null);
      return;
    }
    callback(null, text);
  }
}

module.exports = YamlHandler;
module.exports.handles = ['yml', 'yaml'];
