const assert = require('assert');
const mock = require('mock-require');

let save, written;

describe('Integration | save', () => {
  beforeEach(() => {
    mock('fs', {
      writeFile(file, buffer, callback) {
        written = { file, buffer };
        callback(null);
      }
    });
    save = require('../../lib').save;
  });

  it('should save strings', done => {
    // Arrange
    const file = 'data.txt';
    const data = 'Hello World';
    const options = {};
    const expected = new Buffer('Hello World');
    // Act
    save(file, data, options, err => {
      // Assert
      assert.equal(err, null);
      assert.deepEqual(written.buffer, expected);
      done();
    });
  });

  it('should save json', done => {
    // Arrange
    const file = 'data.json';
    const data = { hello: 'world' };
    const options = {};
    const expected = '{"hello":"world"}';
    // Act
    save(file, data, options, err => {
      // Assert
      assert.equal(err, null);
      assert.equal(written.buffer, expected);
      done();
    });
  });

  it('should save yaml', done => {
    // Arrange
    const file = 'data.yaml';
    const data = { hello: 'world' };
    const options = {};
    const expected = 'hello: world\n';
    // Act
    save(file, data, options, err => {
      // Assert
      assert.equal(err, null);
      assert.equal(written.buffer, expected);
      done();
    });
  });

  it('should save gzipped json', done => {
    // Arrange
    const file = 'data.json.gz';
    const data = { hello: 'world' };
    const options = {};
    const expectedLength = 37;
    // Act
    save(file, data, options, err => {
      // Assert
      assert.equal(err, null);
      assert.equal(written.buffer.length, expectedLength);
      done();
    });
  });

  it('should save zip archives with json', done => {
    // Arrange
    const file = 'data.zip';
    const data = {
      'data1.json': { hello: 'world' },
      'data2.json': { goodnight: 'moon' }
    };
    const options = {};
    // Act
    save(file, data, options, err => {
      // Assert
      assert.equal(err, null);
      // TODO: Account for timestamp changes in result
      done();
    });
  });
});
