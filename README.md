# ext-essentials

Replaces your repetitive read/write and serialize/deserialize boilerplate code with intuitive extension-based conventions. Treat files like data, and let ext-essentials handle the rest!

## Usage

### API

#### load(file[, options], callback)

* `file` &lt;string&gt;
* `options` &lt;Object&gt;
  * `alias` &lt;string&gt; **Default:** `undefined`
* `callback` &lt;Function&gt;
  * `err` &lt;Error&gt;
  * `data`

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
* `data`
* `options` &lt;Object&gt;
  * `alias` &lt;string&gt; **Default:** `undefined`
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
  * `data`
* `options` &lt;Object&gt;
  * `alias` &lt;string&gt; **Default:** `undefined`
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
* `options` &lt;Object&gt;
  * `alias` &lt;string&gt; **Default:** `undefined`
* `callback` &lt;Function&gt;
  * `err` &lt;Error&gt;
  * `data`

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
* `data`
* `options` &lt;Object&gt;
  * `alias` &lt;string&gt; **Default:** `undefined`
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
  const n = parseInt(match[0].substring(3));
  return '.gz'.repeat(n);
});
// .gz3 will be treated as a file gzipped three times in a row,
// for when you want to make super-duper sure it's compressed
```
