const assert = require('assert');
const mock = require('mock-require');

let YamlHandler;

describe('Unit | YamlHandler', () => {
  beforeEach(() => {
    YamlHandler = require('../../../lib/handlers/yaml-handler');
  });

  it('should accept no options', () => {
    // Arrange
    // Act
    const handler = new YamlHandler();
    // Assert
    assert.equal(handler.options, undefined);
  });

  it('should set options during construction', () => {
    // Arrange
    const options = {};
    // Act
    const handler = new YamlHandler(options);
    // Assert
    assert.equal(handler.options, options);
  });

  it('should throw error when missing js-yaml', () => {
    // Arrange
    mock('js-yaml', './missing');
    const expected = /Cannot find module/;
    // Act / Assert
    assert.throws(() => new YamlHandler(), expected);
  });

  describe('deserialize', () => {
    it('should accept loading options', done => {
      // Arrange
      const options = { json: true };
      const handler = new YamlHandler(options);
      const text = 'hello: world\nhello: goodbye';
      const expected = { hello: 'goodbye' };
      // Act
      handler.deserialize(text, (err, actual) => {
        // Assert
        assert.equal(err, null);
        assert.deepEqual(actual, expected);
        done();
      });
    });

    it('should return errors while loading', done => {
      // Arrange
      const handler = new YamlHandler();
      const text = '"bad yaml';
      const expected = /unexpected end of the stream/;
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
    it('should accept dumping options', done => {
      // Arrange
      const options = { sortKeys: true };
      const handler = new YamlHandler(options);
      const data = { hello: 'world', goodnight: 'moon' };
      const expected = 'goodnight: moon\nhello: world\n';
      // Act
      handler.serialize(data, (err, actual) => {
        // Assert
        assert.equal(err, null);
        assert.deepEqual(actual, expected);
        done();
      });
    });

    it('should return errors while dumping', done => {
      // Arrange
      const handler = new YamlHandler();
      const data = { hello: /world/ };
      const expected = /unacceptable kind of an object to dump/;
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
