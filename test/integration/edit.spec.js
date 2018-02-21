const assert = require('assert');
const fs = require('fs');
const mock = require('mock-require');
const mockFs = require('mock-fs');

let edit;

describe('Integration | edit', () => {
  beforeEach(() => {
    edit = mock.reRequire('../../lib/edit');
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

  it('should edit yaml', done => {
    // Arrange
    mockFs({
      'data.json.gz': Buffer.from(
        'H4sIAAAAAAAACqtWykjNyclXslIqzy/KSVGqBQDRQQnYEQAAAA==',
        'base64'
      )
    });
    const file = 'data.json.gz';
    const mutate = data => {
      data.hello += '!';
      return data;
    };
    const options = {};
    const expected = 'H4sIAAAAAAAACqtWykjNyclXslIqzy/KSVFUqgUAzfbfMhIAAAA=';
    // Act
    edit(file, mutate, options, err => {
      const actual = fs.readFileSync('data.json.gz').toString('base64');
      // Assert
      assert.equal(err, null);
      assert.deepEqual(actual, expected);
      done();
    });
  });
});
