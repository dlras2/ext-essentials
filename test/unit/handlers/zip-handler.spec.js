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

  it('should set context during construction', () => {
    // Arrange
    const options = {};
    const context = {};
    // Act
    const handler = new ZipHandler(options, context);
    // Assert
    assert.equal(handler.context, context);
  });

  it('should throw error when missing jszip', () => {
    // Arrange
    mock('jszip', './missing');
    const expected = /Cannot find module/;
    // Act / Assert
    assert.throws(() => new ZipHandler(), expected);
  });

  it('should require jszip only once', () => {
    // Arrange
    new ZipHandler();
    mock('jszip', './missing');
    // Act
    const actual = new ZipHandler();
    // Assert
    assert.ok(actual);
  });

  describe('deserialize', () => {
    it('should pass loaded keys to buildHandlersForAllKeys', done => {
      // Arrange
      const mockZip = { files: { 'data1.json': {}, 'data2.json': {} } };
      const expectedKeys = ['data1.json', 'data2.json'];
      const expectedBuffer = new Buffer(0);
      const expectedErr = new Error();
      let actualBuffer, actualKeys;
      mock('jszip', {
        loadAsync(buffer) {
          actualBuffer = buffer;
          return new Promise((resolve, reject) => resolve(mockZip));
        }
      });
      ZipHandler = mock.reRequire('../../../lib/handlers/zip-handler');
      const handler = new ZipHandler();
      handler.buildHandlersForAllKeys = keys => {
        actualKeys = keys;
        return { err: expectedErr };
      };
      // Act
      handler.deserialize(expectedBuffer, (err, result) => {
        // Assert
        assert.equal(actualBuffer, expectedBuffer);
        assert.deepEqual(actualKeys, expectedKeys);
        assert.equal(err, expectedErr);
        assert.equal(result, null);
        done();
      });
    });
  });

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

  describe('buildHandlersForAllKeys', () => {
    it('should call handlers.buildHandlersForAll with keys and context options', () => {
      // Arrange
      const options = {};
      const context = { file: 'data.zip', options: { zip: options } };
      const keys = ['data1.json', 'data2.json'];
      let actualKeys, actualOptions;
      mock('../../../lib/handlers', {
        buildHandlersForAll(keys, options) {
          actualKeys = keys;
          actualOptions = options;
          return {};
        }
      });
      ZipHandler = mock.reRequire('../../../lib/handlers/zip-handler');
      const handler = new ZipHandler(options, context);
      // Act
      handler.buildHandlersForAllKeys(keys);
      // Assert
      assert.equal(actualKeys, keys);
      assert.equal(actualOptions, context.options);
    });

    it('should return errors from handlers.buildHandlersForAll', () => {
      // Arrange
      const keys = ['data1.json', 'data2.json'];
      const err = 'Error from handlers.buildHandlersForAll';
      const expected = /Error from handlers\.buildHandlersForAll/;
      mock('../../../lib/handlers', {
        buildHandlersForAll(keys, options) {
          return { err };
        }
      });
      ZipHandler = mock.reRequire('../../../lib/handlers/zip-handler');
      const handler = new ZipHandler();
      // Act
      const actual = handler.buildHandlersForAllKeys(keys);
      // Assert
      assert.throws(assert.ifError.bind(this, actual.err), expected);
    });
  });

  it('should return handlersMap with added file context', () => {
    // Arrange
    const options = {};
    const context = { file: 'data.zip', options: { zip: options } };
    const keys = ['data1.json', 'data2.json'];
    const handlersMap = {
      'data1.json': { file: 'data1.json' },
      'data2.json': { file: 'data2.json' }
    };
    const expected = {
      'data1.json': { file: 'data.zip:data1.json' },
      'data2.json': { file: 'data.zip:data2.json' }
    };
    mock('../../../lib/handlers', {
      buildHandlersForAll(keys, options) {
        return { handlersMap };
      }
    });
    ZipHandler = mock.reRequire('../../../lib/handlers/zip-handler');
    const handler = new ZipHandler(options, context);
    // Act
    const actual = handler.buildHandlersForAllKeys(keys);
    // Assert
    assert.deepEqual(actual.handlersMap, expected);
  });
});
