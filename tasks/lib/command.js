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
    argsString.split(' ').reduce(function (previousValue, currentValue, index, array) {
        if (currentValue.startsWith('"')) { return currentValue; }
        if (currentValue.endsWith('"')) {
            args.push(previousValue.replace('"', '') + ' ' + currentValue.replace('"', ''));
        }
        else {
            if (index === 1) { args.push(previousValue); }
            else if (previousValue !== '') { // In enclosing quotes.
                return previousValue + ' ' + currentValue;
            }
            args.push(currentValue);
        }
        return '';
    });
    return args;
};

// Polyfille String.startsWith and endsWith if needed.
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

module.exports = Command;
