const path = require('path')
const paths = require('./paths')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin')
const { TsConfigPathsPlugin } = require('awesome-typescript-loader')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const DashboardPlugin = require('webpack-dashboard/plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const pkg = require(path.join(process.cwd(), 'package.json'))

const config = {
  devtool: 'source-map',
  output: {
    path: paths.appBuild,
    filename: '[name].js',
  },
  resolve: {
    modules: ['node_modules', path.join(__dirname, '../node_modules')],
    extensions: [
      '.ts',
      '.tsx',
      '.js',
      '.jsx',
      '.json',
    ],
    alias: {
      [pkg.name]: process.cwd(),
    },
  },
  module: {
    strictExportPresence: true,
    rules: [
      {
        test: /\.tsx?$/,
        loader: require.resolve('tslint-loader'),
        enforce: 'pre',
        include: paths.appSrc,
      },
      {
        test: /\.jsx?$/,
        loader: require.resolve('babel-loader'),
        exclude: /node_modules/,
      },
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              compilerOptions: {
                module: 'es2015'
              }
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: require.resolve('style-loader'),
          use: [
            {
              loader: require.resolve('css-loader'),
              options: { importLoaders: 2, sourceMap: true },
            },
            {
              loader: require.resolve('postcss-loader'),
              options: {
                sourceMap: true,
                // Necessary for external CSS imports to work
                // https://github.com/facebookincubator/create-react-app/issues/2677
                ident: 'postcss',
                plugins: () => [
                  require('postcss-flexbugs-fixes'),
                  autoprefixer({
                    browsers: [
                      '>1%',
                      'last 4 versions',
                      'Firefox ESR',
                      'not ie < 9', // React doesn't support IE8 anyway
                    ],
                    flexbox: 'no-2009',
                  }),
                ],
              },
            },
            {
              loader: 'sass-loader',
              options: { sourceMap: true },
            },
          ]
        })
      },
    ]
  },
  plugins: [
    new DashboardPlugin(),
    new CaseSensitivePathsPlugin(),
    new TsConfigPathsPlugin({
      tsconfig: paths.tsConfig
    }),
    new ExtractTextPlugin({
      filename: '[name].css'
    })
  ]
}

if (process.env.NODE_ENV === 'development') {
  config.mode = 'development'
  config.entry = [paths.docIndexJs]
  config.plugins.push(
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.docIndexHtml,
    })
  )
} else {
  config.entry = [paths.componentIndexjs]
}

module.exports = config
