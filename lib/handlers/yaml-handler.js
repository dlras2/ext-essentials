let jsYaml; // Lazy-loaded modules

class YamlHandler {
  constructor(options) {
    loadModules();
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

function loadModules() {
  if (jsYaml === undefined) {
    jsYaml = require('js-yaml');
  }
}

module.exports = YamlHandler;
module.exports.handles = ['yml', 'yaml'];
