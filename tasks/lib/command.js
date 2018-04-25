var Command = function Command() { };

/**
 * Splits a command into process and arguments array.
 *
 * @example
 * // returns ['grep', '-e', 'space command']
 * Command.split('grep -e "space command"');
 *
 * @param {string} argsString - A string containing process and arguments.
 * @returns {Array} Process and arguments split into individual string arguments.
 */
Command.split = function split(argsString) {
    var args = [];

    var argsSplitBySpace = argsString.split(' ');

    argsSplitBySpace.reduce(function (previousValue, currentValue, index, array) {
        // Remove surrounding double quotes.
        if (currentValue.startsWith('"') && currentValue.endsWith('"')) {
            args.push(trimDoubleQuote(currentValue));
            return '';
        }

        if (currentValue.startsWith('"') && !currentValue.endsWith('"')) {
            return currentValue;
        }

        // This handles where command is separated by a single space - "a grep".
        if (previousValue.startsWith('"') && currentValue.endsWith('"')) {
            args.push(trimStartDoubleQuote(previousValue) + ' ' + trimEndDoubleQuote(currentValue));
            return '';
        }

        if (previousValue.startsWith('"') && !previousValue.endsWith('"')) {
            return previousValue + ' ' + currentValue;
        }

        args.push(currentValue);
        return '';
    }, '');

    return args;
};

// Polyfill String.startsWith and endsWith if needed.
// From: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith
if (!String.prototype.startsWith) {
  String.prototype.startsWith = function(searchString, position) {
    position = position || 0;
    return this.lastIndexOf(searchString, position) === position;
  };
}

// From: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith
if (!String.prototype.endsWith) {
  String.prototype.endsWith = function(searchString, position) {
    var subjectString = this.toString();
    if (position === undefined || position > subjectString.length) {
      position = subjectString.length;
    }
    position -= searchString.length;
    var lastIndex = subjectString.indexOf(searchString, position);
    return lastIndex !== -1 && lastIndex === position;
  };
}

function trimDoubleQuote(stringToTrim) {
  return trimStartDoubleQuote(trimEndDoubleQuote(stringToTrim));
}

function trimStartDoubleQuote(stringToTrim) {
  return stringToTrim.replace(/^"/, '')
}

function trimEndDoubleQuote(stringToTrim) {
  return stringToTrim.replace(/"$/, '')
}

module.exports = Command;
