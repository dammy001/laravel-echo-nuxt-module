module.exports = function (...args) {
  return import('./dist/module.mjs').then((m) => m.default.call(this, ...args))
}

module.exports.meta = require('./package.json')
