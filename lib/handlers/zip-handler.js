let JsZip, deserializeModule, serializeModule; // Lazy-loaded modules

class ZipHandler {
  constructor(options) {
    JsZip = JsZip || require('jszip');
    deserializeModule = deserializeModule || require('../deserialize');
    serializeModule = serializeModule || require('../serialize');
    this.options = options;
  }
  deserialize(buffer, callback) {
    JsZip.loadAsync(buffer).then(
      zip => {
        const keys = Object.keys(zip.files);
        getFiles.call(this, {}, zip, keys, callback);
      },
      err => {
        // Use set immediate to separate errors in the callback from the promise
        setImmediate(callback, err, null);
      }
    );
  }
  serialize(data, callback) {
    const keys = Object.keys(data).filter(key => data.hasOwnProperty(key));
    addFiles.call(this, new JsZip(), data, keys, (err, zip) => {
      if (err) {
        callback(err);
        return;
      }
      zip.generateAsync({ type: 'nodebuffer' }).then(
        buffer => {
          // Use set immediate to separate errors in the callback from the promise
          setImmediate(callback, null, buffer);
        },
        err => {
          // Use set immediate to separate errors in the callback from the promise
          setImmediate(callback, err, null);
        }
      );
    });
  }
}

module.exports = ZipHandler;
module.exports.handles = ['zip'];

function getFiles(result, zip, keys, callback) {
  if (!keys || keys.length === 0) {
    callback(null, result);
    return;
  }
  const key = keys[0];
  zip
    .file(key)
    .async('nodebuffer')
    .then(
      buffer => {
        deserializeModule(key, buffer, this.options, (err, data) => {
          if (err) {
            // Use set immediate to separate errors in the callback from the promise
            setImmediate(callback, err, null);
            return;
          }
          result[key] = data;
          getFiles.call(this, result, zip, keys.slice(1), callback);
        });
      },
      err => {
        // Use set immediate to separate errors in the callback from the promise
        setImmediate(callback, err, null);
      }
    );
}

function addFiles(zip, data, keys, callback) {
  if (!keys || keys.length === 0) {
    callback(null, zip);
    return;
  }
  const key = keys[0];
  serializeModule(key, data[key], this.options, (err, buffer) => {
    if (err) {
      callback(err, null);
      return;
    }
    zip.file(key, buffer);
    addFiles.call(this, zip, data, keys.slice(1), callback);
  });
}
