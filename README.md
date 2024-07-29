# uuice-cli

## Introduction

UUICE, a cli tool for the blog like `hexo`, can be used as a study project for nestjs.

## api document

[DOC](https://uuice.com/uuice-doc)

[API DOC](https://uuice.com/doc/api)

## Technology

- nestjs: api services and page rendering
- nunjucks: Template engine

## Installation

```bash
# install
$ pnpm add -g uuice-cli
```

## Usage

```bash
# help
$ uuice help
```

```
Usage: uuice-cli [options] [command]

CLI to uuice`s blog

Options:
-V, --version output the version number
-h, --help display help for command

Commands:
new [options] <type> <title> generate new post or page
gen [options] generate data json
server [options] nestjs server
help [command] display help for command
```

## New post or page

```
Usage: uuice-cli new [options] <type> <title>

generate new post or page

Arguments:
  type               type only support post or page
  title              title

Options:
  -p, --path <path>  md file path (default: "")
  -h, --help         display help for command
```

## Generate data.json

```
Usage: uuice-cli gen [options]

generate data json

Options:
  -w, --watch  Listen to the source file directory
  -h, --help   display help for command
```

## Server

```
Usage: uuice-cli server [options]

nestjs server

Options:
  -p, --port <port>  server port (default: "3000")
  -w --watch         Listen to data.json and reload db
  -h, --help         display help for command
```

## License

UUICE is [MIT licensed](LICENSE).
