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
    debug(`Loading ${ctor.name} from ${filename}...`);
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
    const { err, ctor } = getConstructorFor(exts[i]);
    if (err) {
      debug(err);
      return { err };
    }
    const handler = new ctor(options[ctor.name]);
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
      return { ctor: ctors[0] };
    default:
      const handlers = ctors.map(ctor => ctor.name).join(', ');
      return { err: `Conflictling handlers for extension ${ext}: ${handlers}` };
  }
}

function deserialize(file, buffer, callback) {
  if (arguments.length === 2) {
    callback = buffer;
    buffer = file;
    file = this.file;
  }
  if (!this || this.length === 0) {
    callback(null, buffer);
    return;
  }
  const handler = this[0];
  handler.debug(`Deserializing ${file}...`);
  handler.deserialize(buffer, (err, result) => {
    if (err) {
      handler.debug(`Error deserializing ${file}: ${err}`);
      callback(err, null);
      return;
    }
    deserialize.call(this.slice(1), file, result, callback);
  });
}

function serialize(file, data, callback) {
  if (arguments.length === 2) {
    callback = data;
    data = file;
    file = this.file;
  }
  if (!this || this.length === 0) {
    callback(null, data);
    return;
  }
  const handler = this[this.length - 1];
  handler.debug(`Serializing ${file}...`);
  handler.serialize(data, (err, result) => {
    if (err) {
      handler.debug(`Error serializing ${file}: ${err}`);
      callback(err, null);
      return;
    }
    serialize.call(this.slice(0, this.length - 1), file, result, callback);
  });
}
