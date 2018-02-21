const assert = require('assert');
const mock = require('mock-require');

let deserialize;

describe('Integration | deserialize', () => {
  beforeEach(() => {
    deserialize = mock.reRequire('../../lib/deserialize');
  });

  it('should deserialize json', done => {
    // Arrange
    const file = 'data.json';
    const buffer = '{"hello":"world"}';
    const options = {};
    const expected = { hello: 'world' };
    // Act
    deserialize(file, buffer, options, (err, actual) => {
      // Assert
      assert.equal(err, null);
      assert.deepEqual(actual, expected);
      done();
    });
  });

  it('should deserialize yaml', done => {
    // Arrange
    const file = 'data.yaml';
    const buffer = 'hello: world\n';
    const options = {};
    const expected = { hello: 'world' };
    // Act
    deserialize(file, buffer, options, (err, actual) => {
      // Assert
      assert.equal(err, null);
      assert.deepEqual(actual, expected);
      done();
    });
  });

  it('should deserialize gzipped json', done => {
    // Arrange
    const file = 'data.json.gz';
    const buffer = Buffer.from(
      'H4sIAAAAAAAACqtWykjNyclXslIqzy/KSVGqBQDRQQnYEQAAAA==',
      'base64'
    );
    const options = {};
    const expected = { hello: 'world' };
    // Act
    deserialize(file, buffer, options, (err, actual) => {
      // Assert
      assert.equal(err, null);
      assert.deepEqual(actual, expected);
      done();
    });
  });
});
