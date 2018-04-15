const assert = require('assert');

let TextHandler;

describe('Unit | TextHandler', () => {
  beforeEach(() => {
    TextHandler = require('../../../lib/handlers/text-handler');
  });

  it('should accept no options', () => {
    // Arrange
    // Act
    const handler = new TextHandler();
    // Assert
  });

  describe('deserialize', () => {
    it('should pass text through', done => {
      // Arrange
      const handler = new TextHandler();
      const text = 'Hello World';
      const expected = 'Hello World';
      // Act
      handler.deserialize(text, (err, actual) => {
        // Assert
        assert.equal(err, null);
        assert.equal(actual, expected);
        done();
      });
    });

    it('should convert buffers', done => {
      // Arrange
      const handler = new TextHandler();
      const buffer = new Buffer('Hello World');
      const expected = 'Hello World';
      // Act
      handler.deserialize(buffer, (err, actual) => {
        // Assert
        assert.equal(err, null);
        assert.equal(actual, expected);
        done();
      });
    });

    it('should return errors while converting', done => {
      // Arrange
      const handler = new TextHandler();
      const text = { not: 'text' };
      const expected = /TypeError/;
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
    it('should convert text', done => {
      // Arrange
      const handler = new TextHandler();
      const text = 'Hello World';
      const expected = new Buffer('Hello World');
      // Act
      handler.serialize(text, (err, actual) => {
        // Assert
        assert.equal(err, null);
        assert.deepEqual(actual, expected);
        done();
      });
    });

    it('should pass buffers through', done => {
      // Arrange
      const handler = new TextHandler();
      const buffer = new Buffer('Hello World');
      const expected = buffer;
      // Act
      handler.serialize(buffer, (err, actual) => {
        // Assert
        assert.equal(err, null);
        assert.equal(actual, expected);
        done();
      });
    });

    it('should return errors while converting', done => {
      // Arrange
      const handler = new TextHandler();
      const buffer = { not: 'buffer' };
      const expected = /TypeError/;
      // Act
      handler.serialize(buffer, (err, result) => {
        // Assert
        assert.throws(assert.ifError.bind(this, err), expected);
        assert.equal(result, null);
        done();
      });
    });
  });
});
