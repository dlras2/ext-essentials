module.exports = alias;
module.exports.apply = apply;
module.exports.clear = clear;

const extRegExp = /^\.?([^\.\\\/:*"<>|]+(?:\.[^\.\\\/:*"<>|]+)*)$/i;
let replacements = [];

// alias(regexp|extstr, function|extstr)
function alias(replace, as) {
  switch (replace.constructor.name) {
    case 'String':
      const match = replace.match(extRegExp);
      if (match === null) {
        throw new Error(`Invalid file extension(s): ${replace}`);
      }
      const pattern = `\\.${escape(match[1])}(\\b|$)`;
      replace = new RegExp(pattern, 'gi');
      break;
    case 'RegExp':
      break;
    default:
      throw new TypeError(
        `Invalid first argument of type ${replace.constructor.name}`
      );
  }
  switch (as.constructor.name) {
    case 'String':
      const match = as.match(extRegExp);
      if (match === null) {
        throw new Error(`Invalid file extension(s): ${as}`);
      }
      as = `.${match[1]}`;
      break;
    case 'Function':
      break;
    default:
      throw new TypeError(
        `Invalid second argument of type ${as.constructor.name}`
      );
  }
  replacements.push([replace, as]);
}

function apply(base) {
  let alias = base;
  for (const replacement of replacements) {
    alias = alias.replace(...replacement);
  }
  return alias;
}

function clear() {
  replacements = [];
}

// Adapted from https://stackoverflow.com/a/3561711/343238
function escape(s) {
  return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}
