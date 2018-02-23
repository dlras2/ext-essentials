const assert = require('assert');

let JsonHandler;

describe('Unit | JsonHandler', () => {
  beforeEach(() => {
    JsonHandler = require('../../../lib/handlers/json-handler');
  });

  it('should accept no options', () => {
    // Arrange
    // Act
    const handler = new JsonHandler();
    // Assert
    assert.equal(handler.reviver, undefined);
    assert.equal(handler.replacer, undefined);
    assert.equal(handler.space, undefined);
  });

  it('should set options during construction', () => {
    // Arrange
    const options = { reviver, replacer, space: '\t' };
    // Act
    const handler = new JsonHandler(options);
    // Assert
    assert.equal(handler.reviver, options.reviver);
    assert.equal(handler.replacer, options.replacer);
    assert.equal(handler.space, options.space);
  });

  describe('deserialize', () => {
    it('should use the reviver', done => {
      // Arrange
      const options = { reviver };
      const handler = new JsonHandler(options);
      const text = '{"hello":"world"}';
      const expected = { hello: 'world!' };
      // Act
      handler.deserialize(text, (err, actual) => {
        // Assert
        assert.equal(err, null);
        assert.deepEqual(actual, expected);
        done();
      });
    });

    it('should return errors while parsing', done => {
      // Arrange
      const handler = new JsonHandler();
      const text = 'bad json';
      const expected = /SyntaxError/;
      // Act
      handler.deserialize(text, (err, result) => {
        // Assert
        assert.throws(assert.ifError.bind(this, err), expected);
        assert.equal(result, null);
        done();
      });
    });
  });

  describe('serialize', () => {
    it('should use the replacer', done => {
      // Arrange
      const options = { replacer };
      const handler = new JsonHandler(options);
      const data = { hello: 'world', number: 1 };
      const expected = '{"hello":"world"}';
      // Act
      handler.serialize(data, (err, actual) => {
        // Assert
        assert.equal(err, null);
        assert.deepEqual(actual, expected);
        done();
      });
    });

    it('should use the space option', done => {
      // Arrange
      const options = { space: '\t' };
      const handler = new JsonHandler(options);
      const data = { hello: 'world' };
      const expected = '{\n\t"hello": "world"\n}';
      // Act
      handler.serialize(data, (err, actual) => {
        // Assert
        assert.equal(err, null);
        assert.deepEqual(actual, expected);
        done();
      });
    });

    it('should return errors while stringifying', done => {
      // Arrange
      const handler = new JsonHandler();
      const data = { hello: 'world' };
      data.hello = data;
      const expected = /Converting circular structure to JSON/;
      // Act
      handler.serialize(data, (err, result) => {
        // Assert
        assert.throws(assert.ifError.bind(this, err), expected);
        assert.equal(result, null);
        done();
      });
    });
  });
});

function reviver(key, value) {
  return typeof value === 'string' ? `${value}!` : value;
}

function replacer(key, value) {
  return typeof value === 'number' ? undefined : value;
}
