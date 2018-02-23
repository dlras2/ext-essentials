const assert = require('assert');
const mock = require('mock-require');

let ZipHandler;

describe('Unit | ZipHandler', () => {
  beforeEach(() => {
    mock('../../../lib/handlers', {});
    ZipHandler = require('../../../lib/handlers/zip-handler');
  });

  it('should accept no options', () => {
    // Arrange
    // Act
    const handler = new ZipHandler();
    // Assert
    assert.equal(handler.options, undefined);
  });

  it('should set options during construction', () => {
    // Arrange
    const options = {};
    // Act
    const handler = new ZipHandler(options);
    // Assert
    assert.equal(handler.options, options);
  });

  it('should throw error when missing jszip', () => {
    // Arrange
    mock('jszip', './missing');
    const expected = /Cannot find module/;
    // Act / Assert
    assert.throws(() => new ZipHandler(), expected);
  });

  describe('deserialize', () => {});

  describe('serialize', () => {
    it('should refuse to zip null', done => {
      // Arrange
      const handler = new ZipHandler();
      const data = null;
      const expected = /TypeError/;
      // Act
      handler.serialize(data, (err, result) => {
        // Assert
        assert.throws(assert.ifError.bind(this, err), expected);
        assert.equal(result, null);
        done();
      });
    });

    it('should refuse to zip arrays', done => {
      // Arrange
      const handler = new ZipHandler();
      const data = [[], 1, 'two'];
      const expected = /TypeError/;
      // Act
      handler.serialize(data, (err, result) => {
        // Assert
        assert.throws(assert.ifError.bind(this, err), expected);
        assert.equal(result, null);
        done();
      });
    });

    it('should refuse to zip strings', done => {
      // Arrange
      const handler = new ZipHandler();
      const data = 'hello: world';
      const expected = /TypeError/;
      // Act
      handler.serialize(data, (err, result) => {
        // Assert
        assert.throws(assert.ifError.bind(this, err), expected);
        assert.equal(result, null);
        done();
      });
    });

    it('should refuse to zip numbers', done => {
      // Arrange
      const handler = new ZipHandler();
      const data = 1234;
      const expected = /TypeError/;
      // Act
      handler.serialize(data, (err, result) => {
        // Assert
        assert.throws(assert.ifError.bind(this, err), expected);
        assert.equal(result, null);
        done();
      });
    });

    it('should refuse to zip objects with no properties', done => {
      // Arrange
      const handler = new ZipHandler();
      const data = {};
      const expected = /TypeError/;
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
