let JsZip, buildHandlersForAll; // Lazy-loaded modules

class ZipHandler {
  constructor(options) {
    loadModules();
    this.options = options;
  }
  deserialize(buffer, callback) {
    JsZip.loadAsync(buffer).then(
      zip => {
        const keys = Object.keys(zip.files);
        const { err, handlersMap } = buildHandlersForAll(keys, this.options);
        if (err) {
          return callback(err, null);
        }
        const result = {};
        function getFiles(keys, done) {
          if (!keys.length) {
            return done();
          }
          const key = keys[0];
          const deserialize = handlersMap[key].deserialize;
          zip
            .file(key)
            .async('nodebuffer')
            .then(
              buffer => {
                deserialize(buffer, (err, data) => {
                  if (err) {
                    // Use set immediate to separate errors in the callback from the promise
                    return setImmediate(callback, err, null);
                  }
                  result[key] = data;
                  getFiles(keys.slice(1), done);
                });
              },
              err => {
                // Use set immediate to separate errors in the callback from the promise
                setImmediate(callback, err, null);
              }
            );
        }
        getFiles(keys, () => {
          callback(null, result);
        });
      },
      err => {
        // Use set immediate to separate errors in the callback from the promise
        setImmediate(callback, err, null);
      }
    );
  }
  serialize(data, callback) {
    let keys;
    if (
      !data ||
      typeof data !== 'object' ||
      Array.isArray(data) ||
      !(keys = Object.keys(data).filter(key => data.hasOwnProperty(key))).length
    ) {
      const err = new TypeError(`Data must be an object with own properties.`);
      return callback(err, null);
    }
    const { err, handlersMap } = buildHandlersForAll(keys, this.options);
    if (err) {
      return callback(err, null);
    }
    const zip = new JsZip();
    function addFiles(keys, done) {
      if (!keys.length) {
        return done();
      }
      const key = keys[0];
      handlersMap[key].serialize(data[key], (err, buffer) => {
        if (err) {
          return callback(err, null);
        }
        zip.file(key, buffer);
        addFiles(keys.slice(1), done);
      });
    }
    addFiles(keys, () => {
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

function loadModules() {
  if (JsZip === undefined) {
    JsZip = require('jszip');
  }
  if (buildHandlersForAll === undefined) {
    buildHandlersForAll = require('../handlers').buildHandlersForAll;
  }
}

module.exports = ZipHandler;
module.exports.handles = ['zip'];
