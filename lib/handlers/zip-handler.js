let JsZip, buildHandlersForAll; // Lazy-loaded modules

class ZipHandler {
  constructor(options, context) {
    loadModules();
    this.options = options;
    this.context = context;
  }
  deserialize(buffer, callback) {
    JsZip.loadAsync(buffer).then(
      zip => {
        const keys = Object.keys(zip.files);
        const { err, handlersMap } = this.buildHandlersForAllKeys(keys);
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
          // Use set immediate to separate errors in the callback from the promise
          setImmediate(callback, null, result);
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
    const { err, handlersMap } = this.buildHandlersForAllKeys(keys);
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
  buildHandlersForAllKeys(keys) {
    const { err, handlersMap } = buildHandlersForAll(
      keys,
      this.context.options
    );
    if (err) {
      return { err };
    }
    for (const key in handlersMap) {
      if (handlersMap.hasOwnProperty(key)) {
        handlersMap[key].file = `${this.context.file}:${handlersMap[key].file}`;
      }
    }
    return { handlersMap };
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
