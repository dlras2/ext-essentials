const assert = require('assert');
const fs = require('fs');
const mockFs = require('mock-fs');

let edit;

describe('Integration | edit', () => {
  beforeEach(() => {
    edit = require('../../lib').edit;
  });

  it('should edit strings', done => {
    // Arrange
    mockFs({ 'data.txt': new Buffer('Hello World') });
    const file = 'data.txt';
    const mutate = data => {
      data += '!';
      return data;
    };
    const options = {};
    const expected = new Buffer('Hello World!');
    // Act
    edit(file, mutate, options, err => {
      const actual = fs.readFileSync('data.txt');
      // Assert
      assert.equal(err, null);
      assert.deepEqual(actual, expected);
      done();
    });
  });

  it('should edit json', done => {
    // Arrange
    mockFs({ 'data.json': '{"hello":"world"}' });
    const file = 'data.json';
    const mutate = data => {
      data.hello += '!';
      return data;
    };
    const options = {};
    const expected = '{"hello":"world!"}';
    // Act
    edit(file, mutate, options, err => {
      const actual = fs.readFileSync('data.json', 'utf-8');
      // Assert
      assert.equal(err, null);
      assert.deepEqual(actual, expected);
      done();
    });
  });

  it('should edit yaml', done => {
    // Arrange
    mockFs({ 'data.yaml': 'hello: world\n' });
    const file = 'data.yaml';
    const mutate = data => {
      data.hello += '!';
      return data;
    };
    const options = {};
    const expected = 'hello: world!\n';
    // Act
    edit(file, mutate, options, err => {
      const actual = fs.readFileSync('data.yaml', 'utf-8');
      // Assert
      assert.equal(err, null);
      assert.deepEqual(actual, expected);
      done();
    });
  });

  it('should edit gzipped json', done => {
    // Arrange
    const buffer = Buffer.from(
      'H4sIAAAAAAAACqtWykjNyclXslIqzy/KSVGqBQDRQQnYEQAAAA==',
      'base64'
    );
    mockFs({ 'data.json.gz': buffer });
    const file = 'data.json.gz';
    const mutate = data => {
      data.hello += '!';
      return data;
    };
    const options = {};
    const expectedLength = 38;
    // Act
    edit(file, mutate, options, err => {
      const actual = fs.readFileSync('data.json.gz');
      // Assert
      assert.equal(err, null);
      assert.deepEqual(actual.length, expectedLength);
      assert.notDeepEqual(actual, buffer);
      done();
    });
  });

  it('should edit zip archives with json', done => {
    // Arrange
    mockFs({
      'data.zip': Buffer.from(
        'UEsDBAoAAAAAADmAVkzRQQnYEQAAABEAAAAKAAAAZGF0YTEuanNvbnsiaGVsbG8iOiJ3b3JsZCJ9UEsDBAoAAAAAADmAVkwe4UsMFAAAABQAAAAKAAAAZGF0YTIuanNvbnsiZ29vZG5pZ2h0IjoibW9vbiJ9UEsBAhQACgAAAAAAOYBWTNFBCdgRAAAAEQAAAAoAAAAAAAAAAAAAAAAAAAAAAGRhdGExLmpzb25QSwECFAAKAAAAAAA5gFZMHuFLDBQAAAAUAAAACgAAAAAAAAAAAAAAAAA5AAAAZGF0YTIuanNvblBLBQYAAAAAAgACAHAAAAB1AAAAAAA=',
        'base64'
      )
    });
    const file = 'data.zip';
    const mutate = data => {
      data['data1.json'].hello += '!';
      data['data2.json'].goodbye += '!';
      return data;
    };
    const options = {};
    // Act
    edit(file, mutate, options, err => {
      // Assert
      assert.equal(err, null);
      // TODO: Account for timestamp changes in result
      done();
    });
  });
});
