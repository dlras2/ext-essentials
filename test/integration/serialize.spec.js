const assert = require('assert');
const mock = require('mock-require');

let serialize;

describe('Integration | serialize', () => {
  beforeEach(() => {
    serialize = mock.reRequire('../../lib/serialize');
  });

  it('should serialize json', done => {
    // Arrange
    const file = 'data.json';
    const data = { hello: 'world' };
    const options = {};
    const expected = '{"hello":"world"}';
    // Act
    serialize(file, data, options, (err, actual) => {
      // Assert
      assert.equal(err, null);
      assert.equal(actual, expected);
      done();
    });
  });

  it('should serialize yaml', done => {
    // Arrange
    const file = 'data.yaml';
    const data = { hello: 'world' };
    const options = {};
    const expected = 'hello: world\n';
    // Act
    serialize(file, data, options, (err, actual) => {
      // Assert
      assert.equal(err, null);
      assert.equal(actual, expected);
      done();
    });
  });

  it('should serialize gzipped json', done => {
    // Arrange
    const file = 'data.json.gz';
    const data = { hello: 'world' };
    const options = {};
    const expected = 'H4sIAAAAAAAACqtWykjNyclXslIqzy/KSVGqBQDRQQnYEQAAAA==';
    // Act
    serialize(file, data, options, (err, actual) => {
      // Assert
      assert.equal(err, null);
      assert.equal(actual.toString('base64'), expected);
      done();
    });
  });

  it('should serialize zip archives with json', done => {
    // Arrange
    const file = 'data.zip';
    const data = {
      'data1.json': { hello: 'world' },
      'data2.json': { goodnight: 'moon' }
    };
    const options = {};
    // Act
    serialize(file, data, options, (err, actual) => {
      // Assert
      assert.equal(err, null);
      // TODO: Account for timestamp changes in result
      done();
    });
  });
});
