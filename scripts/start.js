process.env.BABEL_ENV = 'development'
process.env.NODE_ENV = 'development'

process.on('unhandledRejection', err => {
  throw err
})

const fs = require('fs')
const chalk = require('chalk')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles')
const clearConsole = require('react-dev-utils/clearConsole')
const openBrowser = require('react-dev-utils/openBrowser')
const {
  choosePort,
  createCompiler,
  prepareProxy,
  prepareUrls,
} = require('react-dev-utils/WebpackDevServerUtils')

const paths = require('../config/paths')
const createDevServerConfig = require('../config/webpackDevServer')
const config = require('../config/componentConfig.js')

// Makes sure that all passed files exist.
// if (!checkRequiredFiles([paths.appHtml, paths.appIndexJs])) {
//   process.exit(1)
// }
const useYarn = fs.existsSync(paths.yarnLockFile)

const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000
const HOST = process.env.HOST || '0.0.0.0'
const isInteractive = process.stdout.isTTY

choosePort(HOST, DEFAULT_PORT)
  .then(port => {
    if (port == null) {
      // We have not found a port.
      return
    }
    const protocol = process.env.HTTPS === 'true' ? 'https' : 'http'
    const projectName = require(paths.projectPackageJson).name
    const urls = prepareUrls(protocol, HOST, port)
    const proxySetting = require(paths.projectPackageJson).proxy
    const proxyConfig = prepareProxy(proxySetting, paths.appPublic)
    const compiler = createCompiler(webpack, config, projectName, urls, useYarn)
    const serverConfig = createDevServerConfig(
      proxyConfig,
      urls.lanUrlForConfig
    )
    const devServer = new WebpackDevServer(compiler, serverConfig)
    devServer.listen(port, HOST, err => {
      if (err) {
        return console.log(err)
      }
      if (isInteractive) {
        clearConsole()
      }
      console.log(chalk.cyan('Starting the development server...\n'))
      openBrowser(urls.localUrlForBrowser)
    })
  })
