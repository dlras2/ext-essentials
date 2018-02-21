const assert = require('assert');
const mock = require('mock-require');
const mockFs = require('mock-fs');

let load;

describe('Integration | load', () => {
  beforeEach(() => {
    load = mock.reRequire('../../lib/load');
  });

  it('should load json', done => {
    // Arrange
    mockFs({ 'data.json': '{"hello":"world"}' });
    const file = 'data.json';
    const options = {};
    const expected = { hello: 'world' };
    // Act
    load(file, options, (err, actual) => {
      // Assert
      assert.equal(err, null);
      assert.deepEqual(actual, expected);
      done();
    });
  });

  it('should load yaml', done => {
    // Arrange
    mockFs({ 'data.yaml': 'hello: world\n' });
    const file = 'data.yaml';
    const options = {};
    const expected = { hello: 'world' };
    // Act
    load(file, options, (err, actual) => {
      // Assert
      assert.equal(err, null);
      assert.deepEqual(actual, expected);
      done();
    });
  });

  it('should load gzipped json', done => {
    // Arrange
    mockFs({
      'data.json.gz': Buffer.from(
        'H4sIAAAAAAAACqtWykjNyclXslIqzy/KSVGqBQDRQQnYEQAAAA==',
        'base64'
      )
    });
    const file = 'data.json.gz';
    const options = {};
    const expected = { hello: 'world' };
    // Act
    load(file, options, (err, actual) => {
      // Assert
      assert.equal(err, null);
      assert.deepEqual(actual, expected);
      done();
    });
  });
});
