const assert = require('assert');
const mock = require('mock-require');

let GzipHandler;

describe('Unit | GzipHandler', () => {
  beforeEach(() => {
    GzipHandler = require('../../../lib/handlers/gzip-handler');
  });

  it('should accept no options', () => {
    // Arrange
    // Act
    const handler = new GzipHandler();
    // Assert
    assert.equal(handler.options, undefined);
  });

  it('should set options during construction', () => {
    // Arrange
    const options = {};
    // Act
    const handler = new GzipHandler(options);
    // Assert
    assert.equal(handler.options, options);
  });

  it('should require zlib only once', () => {
    // Arrange
    new GzipHandler();
    mock('zlib', './missing');
    // Act
    const actual = new GzipHandler();
    // Assert
    assert.ok(actual);
  });

  describe('deserialize', () => {
    it('should return errors while unzipping', done => {
      // Arrange
      const handler = new GzipHandler();
      const buffer = Buffer.from('bad gzip');
      const expected = /incorrect header check/;
      // Act
      handler.deserialize(buffer, (err, result) => {
        // Assert
        assert.throws(assert.ifError.bind(this, err), expected);
        assert.equal(result, null);
        done();
      });
    });
  });

  describe('serialize', () => {
    it('should return errors while zipping', done => {
      // Arrange
      const handler = new GzipHandler();
      const data = { hello: 'world' };
      const expected = /ERR_INVALID_ARG_TYPE/;
      // Act
      handler.serialize(data, (err, result) => {
        // Assert
        assert.ok(err);
        assert.equal(result, null);
        done();
      });
    });
  });
});
