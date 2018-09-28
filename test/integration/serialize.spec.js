const assert = require('assert');

let serialize;

describe('Integration | serialize', () => {
  beforeEach(() => {
    serialize = require('../../lib/').serialize;
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
    const expectedLength = 37;
    // Act
    serialize(file, data, options, (err, actual) => {
      // Assert
      assert.equal(err, null);
      assert.equal(actual.length, expectedLength);
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
