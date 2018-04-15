class TextHandler {
  deserialize(buffer, callback) {
    if (typeof buffer === 'string') {
      callback(null, buffer);
    } else if (buffer.constructor.name === 'Buffer') {
      callback(null, buffer.toString('utf8'));
    } else {
      callback(new TypeError('Expected type Buffer.'), null);
      return;
    }
  }
  serialize(text, callback) {
    if (typeof text === 'string') {
      callback(null, new Buffer(text));
    } else if (text.constructor.name === 'Buffer') {
      callback(null, text);
    } else {
      callback(new TypeError('Expected type string.'), null);
      return;
    }
  }
}

module.exports = TextHandler;
module.exports.handles = ['txt'];
