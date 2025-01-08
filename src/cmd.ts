import pkg from '../package.json'
import { Command } from 'commander'
import { join } from 'node:path'
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import chalk from 'chalk'
import { NestExpressApplication } from '@nestjs/platform-express'
import { getPathByCwd, PATH_OBJECT } from './utils/pathHelper'

export default function (cwd = process.cwd()): void {
  const pathObj = getPathByCwd(cwd)
  const program = new Command()
  program.name('uuice-cli').description('CLI to uuice`s blog').version(pkg.version)

  program
    .command('init')
    .description('initialize the blog')
    .argument('<name>', 'blog folder name')
    .action(async (name) => {
      // TODO: Create a base project
      // TODO: git clone the start package
    })

  program
    .command('new')
    .description('generate new post or page or author')
    .argument('<type>', 'type only support post or page')
    .argument('<title>', 'title')
    .option('-p, --path <path>', 'md file path', '')
    .action(async (type, title, options) => {
      try {
        // check template existed before creating
        const { v6: uuid } = await import('uuid')
        if (type === 'post') {
          const isExistUserTemplate = await fileExists(pathObj.postTemplatePath)
          const templatePath = isExistUserTemplate
            ? pathObj.postTemplatePath
            : pathObj.postTemplatePathDefault
          const postPath = join(pathObj.postDirPath, options.path, title + '.md')
          const templateStr = await readFile(templatePath, 'utf-8')
          const folderPath = join(pathObj.postDirPath, options.path)

          if (await fileExists(postPath)) {
            console.error(
              `${chalk.red('[Error]')}: ${formatDate()}: post ${chalk.magenta(title)} already exists`
            )
          } else {
            if (!(await fileExists(folderPath))) {
              await mkdir(folderPath, { recursive: true })
            }
            const nunjucks = await import('nunjucks')
            const result = nunjucks.renderString(templateStr, {
              id: uuid(),
              title,
              created_time: formatDate(),
              updated_time: formatDate()
            })

            await writeFile(postPath, result, 'utf-8')
            console.log(
              `${chalk.green('[Success]')}: ${formatDate()}: post ${chalk.magenta(title)} created successfully`
            )
          }
        } else if (type === 'page') {
          const isExistUserTemplate = await fileExists(pathObj.pageTemplatePath)
          const templatePath = isExistUserTemplate
            ? pathObj.pageTemplatePath
            : pathObj.pageTemplatePathDefault
          const pagePath = join(pathObj.pageDirPath, options.path, title + '.md')
          const templateStr = await readFile(templatePath, 'utf-8')
          const folderPath = join(pathObj.pageDirPath, options.path)

          if (await fileExists(pagePath)) {
            console.error(
              `${chalk.red('[Error]')}: ${formatDate()}: page ${chalk.magenta(title)} already exists`
            )
          } else {
            if (!(await fileExists(folderPath))) {
              await mkdir(folderPath, { recursive: true })
            }

            const nunjucks = await import('nunjucks')
            const result = nunjucks.renderString(templateStr, {
              id: uuid(),
              title,
              created_time: formatDate(),
              updated_time: formatDate()
            })

            await writeFile(pagePath, result, 'utf-8')
            console.log(
              `${chalk.green('[Success]')}: ${formatDate()}: page ${chalk.magenta(title)} created successfully`
            )
          }
        } else if (type === 'author') {
          const isExistUserTemplate = await fileExists(pathObj.authorTemplatePath)
          const templatePath = isExistUserTemplate
            ? pathObj.authorTemplatePath
            : pathObj.authorTemplatePathDefault
          const authorPath = join(pathObj.authorDirPath, options.path, title + '.md')
          const templateStr = await readFile(templatePath, 'utf-8')
          const folderPath = join(pathObj.authorDirPath, options.path)

          if (await fileExists(authorPath)) {
            console.error(
              `${chalk.red('[Error]')}: ${formatDate()}: Author ${chalk.magenta(title)} already exists`
            )
          } else {
            if (!(await fileExists(folderPath))) {
              await mkdir(folderPath, { recursive: true })
            }

            const nunjucks = await import('nunjucks')
            const result = nunjucks.renderString(templateStr, {
              id: uuid(),
              title,
              created_time: formatDate(),
              updated_time: formatDate()
            })

            await writeFile(authorPath, result, 'utf-8')
            console.log(
              `${chalk.green('[Success]')}: ${formatDate()}: author ${chalk.magenta(title)} created successfully`
            )
          }
        } else {
          console.error(`${chalk.red('[Error]')}: ${formatDate()}: Unknown type`)
        }
      } catch (err: any) {
        console.error(`${chalk.red('[Error]')}: ${formatDate()}: ${err?.message || err}`)
      }
    })

  program
    .command('gen')
    .description('generate data json')
    .option('-w, --watch', 'Listen to the source file directory')
    .action(async (options) => {
      if (options.watch) {
        await generateCommandByWatch(pathObj)
      }
      await generateCommand(pathObj)
    })

  program
    .command('server')
    .description('nestjs server')
    .option('-p, --port <port>', 'server port', '3000')
    .option('-w --watch', 'Listen to data.json and reload db')
    .action(async (options) => {
      // TODO: if watch true, Listen to the source folder and regenerate the data.json file
      try {
        let app: NestExpressApplication

        app = await startServer(options.port, cwd, pathObj.dataBasePath)

        if (options.watch) {
          await generateCommandByWatch(pathObj)

          const chokidar = await import('chokidar')
          console.info(`${chalk.cyan('[Info]')}: ${formatDate()}: start listening on data.json`)
          const watcher = chokidar.watch(pathObj.dataBasePath, {
            ignored: /node_modules/,
            persistent: true
          })

          watcher.on('change', async () => {
            console.info(
              `${chalk.cyan('[Info]')}: ${formatDate()}: data.json file has been modified, restart the server...`
            )
            // const { DbService } = await import('./server/core/service/db.service')
            // const dbServer = app.get(DbService)
            // await dbServer.reload()
            // console.info(`${chalk.cyan('[Info]')}: The database is successfully reloaded.`)
            await app.close()
            console.info(
              `${chalk.cyan('[Info]')}: ${formatDate()}: The server is successfully closed.`
            )
            // Clear module cache
            // has a bug, DynamicPageModule doesn't reinitialize
            // Clear the require cache for dynamic imports to ensure re initialization.
            Object.keys(require.cache).forEach((key) => {
              delete require.cache[key]
            })
            app = await startServer(options.port, cwd, pathObj.dataBasePath, true)
          })

          // !! TODO: Whether to add a listener to the extend directory
          // Listen to the extend directory, restart the service if anything changes
        }
      } catch (err: any) {
        console.error(`${chalk.red('[Error]')}: ${formatDate()}: ${err?.message || err}`)
      }
    })

  program
    .command('build')
    .description('build static files')
    .action(async (options) => {
      // TODO: build web statics
      // TODO: Create the statics of all web pages with nestjs rendering
      // first start server
      // second get all links
      // create file
    })

  program.parse()
}

async function startServer(port: number, cwd: string, dbPath: string, isRestart: boolean = false) {
  const { bootstrap } = await import('./server/main')

  const app = await bootstrap({
    port,
    cwd,
    dbPath
  })

  if (isRestart) {
    console.log(
      `${chalk.green('[Success]')}: ${formatDate()}: server has ${chalk.green('restarted')} at ${chalk.magenta(port)}`
    )
  } else {
    console.log(
      `${chalk.green('[Success]')}: ${formatDate()}: server has ${chalk.green('started')} at ${chalk.magenta(port)}`
    )
  }
  return app
}

async function fileExists(filePath: string) {
  try {
    await stat(filePath)
    return true
  } catch (err) {
    return false
  }
}

function formatDate(data?: string): string {
  const now = data ? new Date(data) : new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

async function generateCommand(pathObject: PATH_OBJECT): Promise<void> {
  try {
    const { generate } = await import('./utils/generate')
    console.info(`${chalk.cyan('[Info]')}: ${formatDate()}: start generating`)
    console.time(`${chalk.cyan('[Info]')}: generate data json`)
    await generate(pathObject)
    console.timeEnd(`${chalk.cyan('[Info]')}: generate data json`)
    console.info(`${chalk.green('[Success]')}: ${formatDate()}: end generating`)
  } catch (err: any) {
    console.error(`${chalk.red('[Error]')}: ${formatDate()}: ${err?.message || err}`)
  }
}

async function generateCommandByWatch(pathObject: PATH_OBJECT) {
  const chokidar = await import('chokidar')
  console.info(`${chalk.cyan('[Info]')}: ${formatDate()}: start listening source file directory`)
  const watcher = chokidar.watch(pathObject.sourcePath, {
    ignored: /node_modules/,
    persistent: true,
    depth: 99,
    ignoreInitial: true
  })

  watcher.on('all', async () => {
    console.info(`${chalk.cyan('[Info]')}: ${formatDate()}: The source file directory has changed`)
    await generateCommand(pathObject)
  })
}
