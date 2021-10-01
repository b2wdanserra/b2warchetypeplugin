b2warchetypes
============

bit2win archetype manager plugin for sfdx projects

[![Version](https://img.shields.io/npm/v/b2warchetype.svg)](https://npmjs.org/package/b2warchetype)
<!--[![Appveyor CI](https://ci.appveyor.com/api/projects/status/github/fimperioli-b2w/b2warchetypeplugin?branch=master&svg=true)](https://ci.appveyor.com/project/heroku/b2warchetypeplugin/branch/master)
[![Codecov](https://codecov.io/gh/fimperioli-b2w/b2warchetypeplugin/branch/master/graph/badge.svg)](https://codecov.io/gh/fimperioli-b2w/b2warchetypeplugin)-->
[![Greenkeeper](https://badges.greenkeeper.io/fimperioli-b2w/b2warchetypeplugin.svg)](https://greenkeeper.io/)
[![Downloads/week](https://img.shields.io/npm/dw/b2warchetype.svg)](https://npmjs.org/package/b2warchetype)
[![License](https://img.shields.io/npm/l/b2warchetype.svg)](https://github.com/fimperioli-b2w/b2warchetypeplugin/blob/master/package.json)


# System requirement

The functionality is released as a sfdx plugins. In order to work the following requirements must be met:

1. Node installed
2. yarn installed `npm install -g yarn`
3. TypeScript installed `npm install -g typescript`
4. Salesforce CLI 7.80 installed https://developer.salesforce.com/tools/sfdxcli. There are some known issues with the 7.90 version, please install a previous version
5. Salesforce sfdx Data-Move-Utility plugin installed. Follow details here https://github.com/forcedotcom/SFDX-Data-Move-Utility


# Installation
```sh-session
$ npm install -g b2warchetype
$ sfdx b2warchetypes:COMMAND
running command...
$ sfdx b2warchetypes --help [COMMAND]
USAGE
  $ sfdx b2warchetypes:COMMAND
...
```

# Commands
#### 1. ExportAll
[`sfdx b2warchetypes:exportall -a <string> [-d] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#)
```
Export All Archetypes source locally from passed sfdx org alias

USAGE
  $ sfdx b2warchetypes:exportall -a <string> [-d] [--json] [--loglevel
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -a, --orgalias=orgalias                                                           (req) Alias of the source
                                                                                    organization
  -d, --debug                                                                       enables debug logging
  --json                                                                            format output as json
  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level
```
#### 2. Save
[`sfdx b2warchetypes:save -n <string> [-d] [--json] [--loglevel
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#)
```
Save archetype bundle locally

USAGE
  $ sfdx b2warchetypes:save -n <string> [-d] [--json] [--loglevel
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -d, --debug                                                                       enables debug logging
  -n, --name=name                                                                   (req) Name of the archetype
  --json                                                                            format output as json
  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level
```
#### 3. Deploy
[`sfdx b2warchetypes:deploy -a <string> [-d] [--json] [--loglevel
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#)
```
Deploy bit2win archetypes to target sfdx organization as data

USAGE
  $ sfdx b2warchetypes:deploy -a <string> [-d] [--json] [--loglevel
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -a, --orgalias=orgalias                                           (req) Alias of the target organization
  -d, --debug                                                                       enables debug logging
  --json                                                                            format output as json
  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level
```
#### 3. CreateArtifact
[`sfdx b2warchetypes:createartifact [-d] [-t] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#)
```
Create artifact folder with csv data  for external deployment tools

USAGE
  $ sfdx b2warchetypes:createartifact [-d] [-t] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -d, --debug                                           enables debug logging
  -t, --timestamp                                       append timestamp to artifact folder to manage uniqueness
  --json                                                format output as json
  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level
```
