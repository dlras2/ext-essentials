# ext-essentials

[![npm](https://img.shields.io/npm/v/ext-essentials.svg)](https://www.npmjs.com/package/ext-essentials)

Replaces your repetitive read/write and serialize/deserialize boilerplate code with intuitive extension-based conventions. Treat files like data, and let ext-essentials handle the rest!

## Usage

### API

#### load(file[, options], callback)

* `file` &lt;string&gt;
* `options` (_see [options](#Options)_)
* `callback` &lt;Function&gt;
  * `err` &lt;Error&gt;
  * `data` (_see [data](#Data)_)

Use `load` to read a file from the file system, deserialize it according to its extensions, and return the data represented inside.

```javascript
const ee = require('ext-essentials');
ee.load('data.json.gz', (err, data) => {
  // data has been read, unzipped, parsed, and ready for use
  console.log(data['hello']);
});
```

#### save(file, data[, options], callback)

* `file` &lt;string&gt;
* `data` (_see [data](#Data)_)
* `options` (_see [options](#Options)_)
* `callback` &lt;Function&gt;
  * `err` &lt;Error&gt;

Use `save` to serialize data according to given extensions, and write the serialized representation to the file system.

```javascript
const ee = require('ext-essentials');
ee.save('data.json.gz', { hello: 'world' }, err => {
  // data has been stringified, g-zipped, and written to disk
});
```

#### edit(file, mutator[, options], callback)

* `file` &lt;string&gt;
* `mutator` &lt;Function&gt;
  * `data` (_see [data](#Data)_)
* `options` (_see [options](#Options)_)
* `callback` &lt;Function&gt;
  * `err` &lt;Error&gt;

Use `edit` to `load` a file from the file system, mutate the data it represents, the `save` that changed data back, all in one single step.

```javascript
const ee = require('ext-essentials');
ee.edit(
  'data.json.gz',
  data => {
    data.hello += '!';
    return data;
  },
  err => {
    // assuming data had a `hello` property, we've updated that value
  }
);
```

#### deserialize(file, buffer[, options], callback)

* `file` &lt;string&gt;
* `buffer` &lt;Buffer&gt;
* `options` (_see [options](#Options)_)
* `callback` &lt;Function&gt;
  * `err` &lt;Error&gt;
  * `data` (_see [data](#Data)_)

Use `deserialize` to deserialize data according to given extensions, and return the data represented inside. Useful for when you have a buffer and file name, but the data doesn't live in the file system.

```javascript
const ee = require('ext-essentials');
ee.deserialize('data.json.gz', buffer, (err, data) => {
  // data has been unzipped, parsed, and ready for use
  console.log(data['hello']);
});
```

#### serialize(file, data[, options], callback)

* `file` &lt;string&gt;
* `data` (_see [data](#Data)_)
* `options` (_see [options](#Options)_)
* `callback` &lt;Function&gt;
  * `err` &lt;Error&gt;
  * `buffer` &lt;Buffer&gt;

Use `serialize` to serialize data according to given extensions. Useful for when you want a buffer, but the data won't be immediately written to the file system.

```javascript
const ee = require('ext-essentials');
ee.serialize('data.json.gz', { hello: 'world' }, (buffer, err) => {
  // data has been stringified and g-zipped
  console.log(buffer.toString('base64'));
});
```

#### alias(replace, as)

* `replace` &lt;string&gt; | &lt;RegExp&gt;
* `as` &lt;string&gt; | &lt;Function&gt;

Use `alias` to define your own extensions to use handlers for other known extensions. Any operation called after an alias is assigned will check the given extensions for applicable aliases.

_NB: When passing in a RegExp to replace, make sure to capture a full extension or set of extensions, including the preceding dot. When passing in a function to alias as, make sure its return value includes the preceding dot. When passing in only strings, a preceding dot is added if missing._

```javascript
const ee = require('ext-essentials');
ee.alias('.dat', '.json.gz');
// .dat will be treated as gzipped json
```

```javascript
const ee = require('ext-essentials');
ee.alias(/\.gz\d+\b/i, match => {
  const n = parseInt(match.substring(3));
  return '.gz'.repeat(n);
});
// .gz3 will be treated as a file gzipped three times in a row,
// for when you want to make super-duper sure it's compressed
```

### Data

The type of data these functions accept and return depends on which handlers are used and in which order. Handlers such as the [JSON](#json-handler) and [YAML](#yaml-handler) handlers accept most kinds of input. Serializing straight to the [Gzip](#gzip-handler) or [Zip](#zip-handler) handlers, for example, have other restrictions and expectations. For more info, see the [handlers section](#Handlers).

### Options

* `options` &lt;Object&gt;
  * `alias` &lt;string&gt; **Default:** `undefined`
  * _`handler`_ &lt;Object&gt;

```javascript
const ee = require('ext-essentials');
const options = {
  alias: 'data.json.gz',
  json: { space: 2 },
  gz: { level: 9 }
};
ee.save('data.dat', { hello: 'world' }, options, err => {
  // data has been stringified, g-zipped, and written to disk
});
```

## Handlers

### text-handler

* Requires: n/a (native)
* Handles: `.txt`
* Serializer/Deserializer: [`Buffer`](https://nodejs.org/api/buffer.html)

### json-handler

* Requires: n/a (native)
* Handles: `.json`
* Serializer: [`JSON.stringify`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)
  * Options: `{` [`replacer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#The_replacer_parameter), [`space`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#The_space_parameter) `}`
* Deserializer: [`JSON.parse`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse)
  * Options: `{` [`reviver`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse#Using_the_reviver_parameter) `}`

### gzip-handler

* Requires: n/a (native)
* Handles: `.gz`, `.gzip`
* Serializer: [`zlib.gzip`](https://nodejs.org/api/zlib.html#zlib_zlib_gzip_buffer_options_callback) ([options](https://nodejs.org/api/zlib.html#zlib_class_options))
* Deserializer: [`zlib.unzip`](https://nodejs.org/api/zlib.html#zlib_zlib_unzip_buffer_options_callback) ([options](https://nodejs.org/api/zlib.html#zlib_class_options))

### yaml-handler

* Requires: [js-yaml](https://www.npmjs.com/package/js-yaml)
* Handles: `.yml`, `.yaml`
* Serializer: [`jsYaml.safeDump`](https://github.com/nodeca/js-yaml#safedump-object---options-)
* Deserializer: [`jsYaml.safeLoad`](https://github.com/nodeca/js-yaml#safeload-string---options-)

### zip-handler

* Requires: [jszip](https://www.npmjs.com/package/jszip)
* Handles: `.zip`

This handler serializes and deserializes multi-file zip archives. It loads the files as an object, with each key being the path of an archived file, and its value being the data loaded and deserialized by its extensions. It saves in the opposite fashion.

## TODO

* [ ] XML handler
* [ ] CSV handler
* [ ] Positional (array-based) options
