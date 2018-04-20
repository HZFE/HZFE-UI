const path = require('path')
const paths = require('./paths')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin')
const { TsConfigPathsPlugin } = require('awesome-typescript-loader')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const DashboardPlugin = require('webpack-dashboard/plugin')

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
      '.web.tsx',
      '.web.ts',
      '.web.jsx',
      '.web.js',
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
      // tslint
      {
        test: /\.(ts|tsx)$/,
        loader: require.resolve('tslint-loader'),
        enforce: 'pre',
        include: paths.appSrc,
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.(ts|tsx)$/,
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
        test: /\.css$/,
        use: [
          require.resolve('style-loader'),
          {
            loader: require.resolve('css-loader'),
            options: {
              importLoaders: 1,
            },
          },
          {
            loader: require.resolve('postcss-loader'),
            options: {
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
        ],
      },
    ]
  },
  plugins: [
    new DashboardPlugin(),
    new TsConfigPathsPlugin({
      tsconfig: paths.tsConfig
    }),
    // new InterpolateHtmlPlugin({
    //   PUBLIC_URL: '/',
    //   NODE_ENV: process.env.NODE_ENV || 'development',
    // }),
    new CaseSensitivePathsPlugin(),
  ]
}

if (process.env.NODE_ENV === 'development') {
  config.mode = 'development'
  config.entry = [paths.docIndexJs]
  config.plugins.push(
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.docHtml,
    })
  )
} else {
  config.entry = [paths.componentIndexjs]
}

module.exports = config