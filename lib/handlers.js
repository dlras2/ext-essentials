const aliasModule = require('./alias');
const debugModule = require('debug');
const path = require('path');
const requireDirectory = require('require-directory');

const debug = debugModule('ext-essentials');

module.exports = { buildHandlersFor, buildHandlersForAll };

const constructors = {};
requireDirectory(module, './handlers', {
  include: /\bhandler\b/i,
  extensions: ['js'],
  visit: (ctor, joined, filename) => {
    if (ctor.prototype.debug === undefined) {
      ctor.prototype.debug = debugModule(`ext-essentials:${ctor.name}`);
    }
    for (const ext of ctor.handles || []) {
      constructors[ext] = constructors[ext] || [];
      constructors[ext].push(ctor);
    }
  }
});

function buildHandlersFor(file, options) {
  options = options || {};
  const exts = parseExtensions(file, options);
  const handlers = [];
  for (let i = exts.length - 1; i >= 0; i--) {
    const { err, Handler } = getConstructorFor(exts[i]);
    if (err) {
      debug(err);
      return { err };
    }
    const handlerOptions = options[Handler.name];
    const handler = new Handler(handlerOptions, { file, options });
    handlers.push(handler);
  }
  handlers.file = file;
  handlers.deserialize = deserialize.bind(handlers);
  handlers.serialize = serialize.bind(handlers);
  return { handlers };
}

function buildHandlersForAll(files, options) {
  const handlersMap = {};
  for (const file of files) {
    const { err, handlers } = buildHandlersFor(file, options);
    if (err) {
      return { err };
    }
    handlersMap[file] = handlers;
  }
  return { handlersMap };
}

function parseExtensions(file, options) {
  let alias;
  if (options && options.alias) {
    alias = options.alias;
  } else {
    const { base } = path.parse(file);
    alias = aliasModule.apply(base);
  }
  alias = alias.toLowerCase();
  const exts = alias.split('.').slice(1);
  return exts;
}

function getConstructorFor(ext) {
  const ctors = constructors[ext] || [];
  switch (ctors.length) {
    case 0:
      return { err: `Unable to find a handler for extension ${ext}.` };
    case 1:
      return { Handler: ctors[0] };
    default:
      const handlers = ctors.map(Handler => Handler.name).join(', ');
      return { err: `Conflictling handlers for extension ${ext}: ${handlers}` };
  }
}

function deserialize(file, buffer, callback) {
  if (!this || this.length === 0) {
    return callback(null, buffer);
  }
  if (arguments.length === 2) {
    callback = buffer;
    buffer = file;
    file = this.file;
  }
  const handler = this[0];
  handler.debug(`Deserializing ${file}...`);
  handler.deserialize(buffer, (err, result) => {
    if (err) {
      handler.debug(`Error deserializing ${file}: ${err}`);
      return callback(err, null);
    }
    deserialize.call(this.slice(1), file, result, callback);
  });
}

function serialize(file, data, callback) {
  if (!this || this.length === 0) {
    return callback(null, data);
  }
  if (arguments.length === 2) {
    callback = data;
    data = file;
    file = this.file;
  }
  const handler = this[this.length - 1];
  handler.debug(`Serializing ${file}...`);
  handler.serialize(data, (err, result) => {
    if (err) {
      handler.debug(`Error serializing ${file}: ${err}`);
      return callback(err, null);
    }
    serialize.call(this.slice(0, this.length - 1), file, result, callback);
  });
}
