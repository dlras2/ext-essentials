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

  it('should load zip archives with json', done => {
    // Arrange
    mockFs({
      'data.zip': Buffer.from(
        'UEsDBAoAAAAAADmAVkzRQQnYEQAAABEAAAAKAAAAZGF0YTEuanNvbnsiaGVsbG8iOiJ3b3JsZCJ9UEsDBAoAAAAAADmAVkwe4UsMFAAAABQAAAAKAAAAZGF0YTIuanNvbnsiZ29vZG5pZ2h0IjoibW9vbiJ9UEsBAhQACgAAAAAAOYBWTNFBCdgRAAAAEQAAAAoAAAAAAAAAAAAAAAAAAAAAAGRhdGExLmpzb25QSwECFAAKAAAAAAA5gFZMHuFLDBQAAAAUAAAACgAAAAAAAAAAAAAAAAA5AAAAZGF0YTIuanNvblBLBQYAAAAAAgACAHAAAAB1AAAAAAA=',
        'base64'
      )
    });
    const file = 'data.zip';
    const options = {};
    const expected = {
      'data1.json': { hello: 'world' },
      'data2.json': { goodnight: 'moon' }
    };
    // Act
    load(file, options, (err, actual) => {
      // Assert
      assert.equal(err, null);
      assert.deepEqual(actual, expected);
      done();
    });
  });
});
