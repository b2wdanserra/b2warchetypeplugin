b2warchetype
============

bit2win archetype manager plugin for sfdx projects

[![Version](https://img.shields.io/npm/v/b2warchetype.svg)](https://npmjs.org/package/b2warchetype)
<!--[![Appveyor CI](https://ci.appveyor.com/api/projects/status/github/fimperioli-b2w/b2warchetypeplugin?branch=master&svg=true)](https://ci.appveyor.com/project/heroku/b2warchetypeplugin/branch/master)
[![Codecov](https://codecov.io/gh/fimperioli-b2w/b2warchetypeplugin/branch/master/graph/badge.svg)](https://codecov.io/gh/fimperioli-b2w/b2warchetypeplugin)-->
[![Greenkeeper](https://badges.greenkeeper.io/fimperioli-b2w/b2warchetypeplugin.svg)](https://greenkeeper.io/)
[![Downloads/week](https://img.shields.io/npm/dw/b2warchetype.svg)](https://npmjs.org/package/b2warchetype)
[![License](https://img.shields.io/npm/l/b2warchetype.svg)](https://github.com/fimperioli-b2w/b2warchetypeplugin/blob/master/package.json)

# Installation
```sh-session
$ npm install -g b2warchetype
$ sfdx COMMAND
running command...
$ sfdx (-v|--version|version)
b2warchetype/0.0.0 win32-x64 node-v14.17.0
$ sfdx --help [COMMAND]
USAGE
  $ sfdx COMMAND
...
```
* [`sfdx hello:org [-n <string>] [-f] [-v <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-helloorg--n-string--f--v-string--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)

## `sfdx hello:org [-n <string>] [-f] [-v <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

print a greeting and your org IDs

```
print a greeting and your org IDs

USAGE
  $ sfdx hello:org [-n <string>] [-f] [-v <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel 
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -f, --force                                                                       example boolean flag
  -n, --name=name                                                                   name to print

  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  -v, --targetdevhubusername=targetdevhubusername                                   username or alias for the dev hub
                                                                                    org; overrides default dev hub org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLES
  $ sfdx hello:org --targetusername myOrg@example.com --targetdevhubusername devhub@org.com
     Hello world! This is org: MyOrg and I will be around until Tue Mar 20 2018!
     My hub org id is: 00Dxx000000001234
  
  $ sfdx hello:org --name myname --targetusername myOrg@example.com
     Hello myname! This is org: MyOrg and I will be around until Tue Mar 20 2018!
```
