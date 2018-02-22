const clearRequire = require('clear-require');
const mock = require('mock-require');
const mockFs = require('mock-fs');

beforeEach(() => {
  clearRequire.match(/[\/\\]ext-essentials[\/\\]lib[\/\\]/i);
});

afterEach(() => {
  mockFs.restore();
  mock.stopAll();
});

process.on('unhandledRejection', e => console.error(e));
