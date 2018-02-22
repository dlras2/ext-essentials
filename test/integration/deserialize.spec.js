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

  it('should deserialize zip archives with json', done => {
    // Arrange
    const file = 'data.zip';
    const buffer = Buffer.from(
      'UEsDBAoAAAAAADmAVkzRQQnYEQAAABEAAAAKAAAAZGF0YTEuanNvbnsiaGVsbG8iOiJ3b3JsZCJ9UEsDBAoAAAAAADmAVkwe4UsMFAAAABQAAAAKAAAAZGF0YTIuanNvbnsiZ29vZG5pZ2h0IjoibW9vbiJ9UEsBAhQACgAAAAAAOYBWTNFBCdgRAAAAEQAAAAoAAAAAAAAAAAAAAAAAAAAAAGRhdGExLmpzb25QSwECFAAKAAAAAAA5gFZMHuFLDBQAAAAUAAAACgAAAAAAAAAAAAAAAAA5AAAAZGF0YTIuanNvblBLBQYAAAAAAgACAHAAAAB1AAAAAAA=',
      'base64'
    );
    const options = {};
    const expected = {
      'data1.json': { hello: 'world' },
      'data2.json': { goodnight: 'moon' }
    };
    // Act
    deserialize(file, buffer, options, (err, actual) => {
      // Assert
      assert.equal(err, null);
      assert.deepEqual(actual, expected);
      done();
    });
  });
});
