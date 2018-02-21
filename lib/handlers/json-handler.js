class JsonHandler {
  constructor(options) {
    if (options) {
      this.reviver = options.reviver;
      this.replacer = options.replacer;
      this.space = options.space;
    }
  }
  deserialize(text, callback) {
    let data;
    try {
      data = JSON.parse(text, this.reviver);
    } catch (err) {
      callback(err, null);
      return;
    }
    callback(null, data);
  }
  serialize(data, callback) {
    let text;
    try {
      text = JSON.stringify(data, this.replacer, this.space);
    } catch (err) {
      callback(err, null);
      return;
    }
    callback(null, text);
  }
}

module.exports = JsonHandler;
module.exports.handles = ['json'];
