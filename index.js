module.exports = function (grunt) {
    return {
        action: require('./tasks/lib/action')(grunt)
    };
};