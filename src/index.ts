import pkg from '../package.json'
import { Command } from 'commander'
import { join } from 'node:path'
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import chalk from 'chalk'
import { NestExpressApplication } from '@nestjs/platform-express'

export default function (cwd = process.cwd()): void {
  const sourcePath = join(cwd, 'source')
  const systemConfigPath = join(cwd, 'config.yml')
  const dataBasePath = join(cwd, 'data.json')
  const pageDirPath = join(sourcePath, '_pages')
  const postDirPath = join(sourcePath, '_posts')
  const jsonDirPath = join(sourcePath, '_jsons')
  const ymlDirPath = join(sourcePath, '_ymls')

  const pageTemplatePath = join(cwd, 'templates', 'page.njk')
  const postTemplatePath = join(cwd, 'templates', 'post.njk')

  const pageTemplatePathDefault = join(__dirname, '../templates', 'page.njk')
  const postTemplatePathDefault = join(__dirname, '../templates', 'post.njk')

  const program = new Command()
  program.name('uuice-cli').description('CLI to uuice`s blog').version(pkg.version)
  program
    .command('new')
    .description('generate new post or page')
    .argument('<type>', 'type only support post or page')
    .argument('<title>', 'title')
    .option('-p, --path <path>', 'md file path', '')
    .action(async (type, title, options) => {
      try {
        // check template existed before creating
        const { v6: uuid } = await import('uuid')
        if (type === 'post') {
          const isExistUserTemplate = await fileExists(postTemplatePath)
          const templatePath = isExistUserTemplate ? postTemplatePath : postTemplatePathDefault
          const postPath = join(postDirPath, options.path, title + '.md')
          const templateStr = await readFile(templatePath, 'utf-8')
          const folderPath = join(postDirPath, options.path)

          if (await fileExists(postPath)) {
            console.error(`${chalk.red('[Error]')}: post ${chalk.magenta(title)} already exists`)
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
              `${chalk.green('[Success]')}: post ${chalk.magenta(title)} created successfully`
            )
          }
        } else if (type === 'page') {
          const isExistUserTemplate = await fileExists(pageTemplatePath)
          const templatePath = isExistUserTemplate ? pageTemplatePath : pageTemplatePathDefault
          const pagePath = join(pageDirPath, options.path, title + '.md')
          const templateStr = await readFile(templatePath, 'utf-8')
          const folderPath = join(pageDirPath, options.path)

          if (await fileExists(pagePath)) {
            console.error(`${chalk.red('[Error]')}: page ${chalk.magenta(title)} already exists`)
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
              `${chalk.green('[Success]')}: page ${chalk.magenta(title)} created successfully`
            )
          }
        } else {
          console.error(`${chalk.red('[Error]')}: Unknown type`)
        }
      } catch (err: any) {
        console.error(`${chalk.red('[Error]')}: ${err?.message || err}`)
      }
    })

  program
    .command('gen')
    .description('generate data json')
    .option('-w, --watch', 'Listen to the source file directory')
    .action(async (options) => {
      if (options.watch) {
        await generateCommandByWatch(
          postDirPath,
          pageDirPath,
          jsonDirPath,
          ymlDirPath,
          systemConfigPath,
          dataBasePath,
          sourcePath
        )
      }
      await generateCommand(
        postDirPath,
        pageDirPath,
        jsonDirPath,
        ymlDirPath,
        systemConfigPath,
        dataBasePath
      )
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

        app = await startServer(options.port, cwd, dataBasePath)

        if (options.watch) {
          await generateCommandByWatch(
            postDirPath,
            pageDirPath,
            jsonDirPath,
            ymlDirPath,
            systemConfigPath,
            dataBasePath,
            sourcePath
          )

          const chokidar = await import('chokidar')
          console.info(`${chalk.cyan('[Info]')}: start listening on data.json`)
          const watcher = chokidar.watch(dataBasePath, {
            ignored: /node_modules/,
            persistent: true
          })

          watcher.on('change', async () => {
            console.info(
              `${chalk.cyan('[Info]')}: data.json file has been modified, restart the server...`
            )
            // const { DbService } = await import('./server/core/service/db.service')
            // const dbServer = app.get(DbService)
            // await dbServer.reload()
            // console.info(`${chalk.cyan('[Info]')}: The database is successfully reloaded.`)
            await app.close()
            console.info(`${chalk.cyan('[Info]')}: The server is successfully closed.`)
            app = await startServer(options.port, cwd, dataBasePath, true)
          })
        }
      } catch (err: any) {
        console.error(`${chalk.red('[Error]')}: ${err?.message || err}`)
      }
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
      `${chalk.green('[Success]')}: server has ${chalk.green('restarted')} at ${chalk.magenta(port)}`
    )
  } else {
    console.log(
      `${chalk.green('[Success]')}: server has ${chalk.green('started')} at ${chalk.magenta(port)}`
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

async function generateCommand(
  postDirPath: string,
  pageDirPath: string,
  jsonDirPath: string,
  ymlDirPath: string,
  systemConfigPath: string,
  dataBasePath: string
): Promise<void> {
  try {
    const { generate } = await import('./utils/generate')
    console.info(`${chalk.cyan('[Info]')}: start generating`)
    console.time(`${chalk.cyan('[Info]')}: generate data json`)
    await generate(
      postDirPath,
      pageDirPath,
      jsonDirPath,
      ymlDirPath,
      systemConfigPath,
      dataBasePath
    )
    console.timeEnd(`${chalk.cyan('[Info]')}: generate data json`)
    console.info(`${chalk.green('[Success]')}: end generating`)
  } catch (err: any) {
    console.error(`${chalk.red('[Error]')}: ${err?.message || err}`)
  }
}

async function generateCommandByWatch(
  postDirPath: string,
  pageDirPath: string,
  jsonDirPath: string,
  ymlDirPath: string,
  systemConfigPath: string,
  dataBasePath: string,
  sourcePath: string
) {
  const chokidar = await import('chokidar')
  console.info(`${chalk.cyan('[Info]')}: start listening source file directory`)
  const watcher = chokidar.watch(sourcePath, {
    ignored: /node_modules/,
    persistent: true,
    depth: 99,
    ignoreInitial: true
  })

  watcher.on('all', async () => {
    console.info(`${chalk.cyan('[Info]')}: The source file directory has changed`)
    await generateCommand(
      postDirPath,
      pageDirPath,
      jsonDirPath,
      ymlDirPath,
      systemConfigPath,
      dataBasePath
    )
  })
}
