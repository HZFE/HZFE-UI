const webpack = require('webpack')
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages')

const config = require('../config/componentConfig.js')

const compiler = webpack(config)
compiler.run()