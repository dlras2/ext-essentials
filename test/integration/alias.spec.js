const assert = require('assert');
const fs = require('fs');
const mockFs = require('mock-fs');

let alias;

describe('Integration | alias', () => {
  beforeEach(() => {
    alias = require('../../lib').alias;
  });

  it('should accept simple extension replacements', () => {
    // Arrange
    const expected = 'data.json.gz';
    alias('.dat', '.json.gz');
    // Act
    const actual = alias.apply('data.dat');
    // Assert
    assert.equal(actual, expected);
  });

  it('should accept regex and function replacements', () => {
    // Arrange
    const expected = 'data.gz.gz.gz';
    alias(/\.gz\d+\b/i, match => {
      const n = parseInt(match.substring(3));
      return '.gz'.repeat(n);
    });
    // Act
    const actual = alias.apply('data.gz3');
    // Assert
    assert.equal(actual, expected);
  });
});
