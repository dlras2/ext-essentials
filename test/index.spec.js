const mock = require('mock-require');
const mockFs = require('mock-fs');

afterEach(() => {
  mockFs.restore();
  mock.stopAll();
});

process.on('unhandledRejection', e => console.error(e));
