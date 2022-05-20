b2warchetypes
============

bit2win archetype manager plugin for sfdx projects

[![Version](https://img.shields.io/npm/v/b2warchetype.svg)](https://www.npmjs.com/package/b2warchetype)
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
$ sfdx plugins:install b2warchetype
$ sfdx b2warchetypes:COMMAND
running command...
$ sfdx b2warchetypes --help [COMMAND]
USAGE
  $ sfdx b2warchetypes:COMMAND
...
```

# Commands
#### 1. ExportAll
[`sfdx b2warchetypes:exportall [-u <string>] [-d] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#)
```
Export All Archetypes source locally from passed sfdx org alias

USAGE
  $ sfdx b2warchetypes:exportall [-u <string>] [-d] [--json] [--loglevel
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -u, --targetusername=targetusername           username or alias for the target org; overrides default target org
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
[`sfdx b2warchetypes:deploy [-u <string>] [-d] [--json] [--loglevel
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#)
```
Deploy bit2win archetypes to target sfdx organization as data

USAGE
  $ sfdx b2warchetypes:deploy [-u <string>] [-d] [--json] [--loglevel
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -u, --targetusername=targetusername           username or alias for the target org; overrides default target org
  -d, --debug                                                                       enables debug logging
  --json                                                                            format output as json
  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level
```
#### 4. CreateArtifact
[`sfdx b2warchetypes:createartifact [-u <string>] [-d] [-t] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#)
```
Create artifact folder with csv data  for external deployment tools

USAGE
  $ sfdx b2warchetypes:createartifact [-u <string>] [-d] [-t] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -u, --targetusername=targetusername                   username or alias for the target org; overrides default target org
  -d, --debug                                           enables debug logging
  -t, --timestamp                                       append timestamp to artifact folder to manage uniqueness
  --json                                                format output as json
  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level
```
#### 5. Create (Beta)

The create command has a set of subcommands that allow the creation of archetype related entities from scratch, building the file bundle step by step
##### V1.2.0:  Create command is at ALPHA in this version, correct behaviour is not guaranteed so it has been excluded from read me until next minor release

<!-- ### 5.1 create:archetype
[`sfdx b2warchetypes:create:archetype -n <string> [-d] [-c <string>] [-a <string>] [-u <string>] [--apiversion
  <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#)

```
Create a boilerplate archetype bundle with a default condition and default action step

USAGE
  $ sfdx b2warchetypes:create:archetype -n <string> [-d] [-c <string>] [-a <string>] [-u <string>] [--apiversion
  <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -a, --actionname=actionname                   Name of the archetype action associated to this archetype

  -c, --conditionname=conditionname             Name of the archetype condition associated to this archetype

  -d, --debug                                   enables debug logging

  -n, --name=name                               (required) The name of the newly created archetype

  -u, --targetusername=targetusername           username or alias for the target org; overrides default target org

  --apiversion=apiversion                       override the api version used for api requests made by this command

  --json                                        format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level
```

### 5.2 create:action

[`sfdx b2warchetypes:create:action -n <string> -b <string> [-d] [-u <string>] [--apiversion <string>] [--json]
  [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#)
  
```

Create an empty action instance to associate to an existing archetype bundle inside the current project

USAGE
  $ sfdx b2warchetypes:create:action -n <string> -b <string> [-d] [-u <string>] [--apiversion <string>] [--json]
  [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -b, --archetypename=archetypename             (required) Name of the archetype to which associate the action

  -d, --debug                                   enables debug logging

  -n, --actionname=actionname                   (required) The name of the newly created archetype action

  -u, --targetusername=targetusername           username or alias for the target org; overrides default target org

  --apiversion=apiversion                       override the api version used for api requests made by this command

  --json                                        format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation
```

### 5.3 create:condition

[`sfdx b2warchetypes:create:condition -n <string> -b <string> [-d] [-u <string>] [--apiversion <string>] [--json]
  [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#)
  
```

Create a boilerplate condition file and instance associated to an existing archetype bundle inside the current project

USAGE
  $ sfdx b2warchetypes:create:condition -n <string> -b <string> [-d] [-u <string>] [--apiversion <string>] [--json]
  [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -b, --archetypename=archetypename         (required) Name of the archetype to which associate the condition

  -d, --debug                               enables debug logging

  -n, --conditionname=conditionname         (required) The name of the newly created archetype condition

  -u, --targetusername=targetusername       username or alias for the target org; overrides default target org

  --apiversion=apiversion                   override the api version used for api requests made by this command

  --json                                    format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation
```

### 5.4 create:actionstep 

[`sfdx b2warchetypes:create:actionstep -n <string> -a <string> -b <string> -s <number> [-d] [-u <string>]
  [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#)
  
```
Create an action step boilerplate js file/instance associated to an existing archetype bundle inside the current project


USAGE
  $ sfdx b2warchetypes:create:actionstep -n <string> -a <string> -b <string> -s <number> [-d] [-u <string>]
  [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -a, --actionname=actionname    (required) The name of the existing archetype action to associate the newly created step

  -b, --archetypename=archetypename   (required) Name of the archetype to which associate the action step

  -d, --debug                         enables debug logging

  -n, --stepname=stepname             (required) The name of the newly created archetype action step

  -s, --sequence=sequence             (required) The Execution sequence of the archetype action step

  -u, --targetusername=targetusername     username or alias for the target org; overrides default target org

  --apiversion=apiversion           override the api version used for api requests made by this command

  --json                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation
```
-->
