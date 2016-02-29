# grunt-launch

> grunt-launch is an application deployment framework based on bengourley/launch but built for Grunt.

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-launch --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-launch');
```

## The "launch" task

### Overview
In your project's Gruntfile, add a section named `launch` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  launch: {
    info: {
      options: {
        branch: 'deploy52',
        git: true,
        remote: '?',
        remotepath: '~/',
        sitePath: '/var/www',
        tempDir: '/tmp/my-proj-launch/',
        bower: {
          force: false,
          production: true
        }
      }
    },
    installDependencies: true,
    installBowerDependencies: false,
    createVersionedDir: true,
    moveTempToVersioned: true,
    symbolicLink: true
  },
})
```

### Options

#### info.options.branch
Type: `String`
Default value: `None`

The branch to checkout from the repo.

#### info.options.git
Type: `Boolean`
Default value: `None`

Whether or not to use git to deploy.

When `git: true`, you will need to add a post-receive hook to call grunt launch on the server when you push.

TODO: Add example of `post-receive` hook.

#### info.options.sitePath
Type: `String`
Default value: `None`

The folder to which to deploy the project.

#### info.options.tempDir
Type: `String`
Default value: `/tmp/[project-name]-launch`

The temporary folder for staging files.

#### info.options.subDir
Type: `String`
Default value: `''`

The sub-directory to push to remote. Useful for distributions/builds/uglifying.

#### info.bowerOptions.force
Type: `Boolean`
Default value: `false`

[Forces](http://bower.io/docs/api/#install-options) the latest version on conflict.

#### info.bowerOptions.production
Type: `Boolean`
Default value: `false`

Installs [production](http://bower.io/docs/api/#install-options) dependencies only.


#### TODO: Add details for each step - removeOldTempDir, etc.

### Usage Examples

#### Default Options


```js
grunt.initConfig({
  launch: {
    info: {
      options: {},
      bowerOptions: {
        force: true,
        production: true
      }
    },
    installDependencies: true,
    installBowerDependencies: true,
    createVersionedDir: true,
    moveTempToVersioned: true,
    symbolicLink: true
  },
})
```

#### Custom Options
TODO: Add custom option example.

```js
grunt.initConfig({
  launch: {
    options: {
    },
    installDependencies: true,
    installBowerDependencies: true,
    createVersionedDir: true,
    moveTempToVersioned: true,
    symbolicLink: true
  },
})
```

#### Command-line options
Some options may be specified from the command-line.

##### --pkg
```bash
grunt launch --pkg=2.1.0
```

#### Action tools

##### action.local
```js
var action = require('grunt-launch')(grunt).action;
action.local('grep -e "space command" somefile.js', function (exitcode) {
  // do something
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
* 0.4.0 - Added support for spaces in command arguments.
* 0.4.1 - Added support for multiple spaces in command arguments.
* 0.4.2 - Added support for multiple spaces in command _at beginning_.
* 0.5.0 - Optionally install bower dependencies and prepare for Grunt 1.0.
