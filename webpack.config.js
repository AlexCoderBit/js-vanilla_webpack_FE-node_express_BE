const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlPlugin = require('html-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');
const options = require('./webpack.options');

const lintJSOptions = {
  emitWarning: true,
  // Fail only on errors
  failOnWarning: false,
  failOnError: false,

  // Toggle autofix
  fix: true,
  cache: true,

  formatter: require('eslint-friendly-formatter')
};

const PATHS = {
  src: path.join(__dirname, 'src'),
  build: path.join(__dirname, 'build')
};

const lintStylesOptions = {
  context: path.resolve(__dirname, `${PATHS.src}/styles`),
  syntax: 'scss',
  emitErrors: false
};

const cssPreprocessorLoader = { loader: 'fast-sass-loader' };

const developmentConfig = merge([
  {
    context: PATHS.src,
    resolve: {
      unsafeCache: true,
      symlinks: false
    },
    entry: ['babel-polyfill', `${PATHS.src}/scripts`],
    output: {
      devtoolModuleFilenameTemplate: 'webpack:///[absolute-resource-path]',
      path: PATHS.build,
      publicPath: options.publicPath
    },
    plugins: [
      new HtmlPlugin({
        template: './index.pug'
      }),
      new FriendlyErrorsPlugin(),
      new StylelintPlugin(lintStylesOptions),
      new webpack.NamedModulesPlugin()
    ],
    module: {
      noParse: /\.min\.js/
    }
  },
  options.devServer({
    host: process.env.HOST,
    port: process.env.PORT
  }),
  options.loadPug(),
  options.loadCSS({ include: PATHS.src, use: [cssPreprocessorLoader] }),
  options.extractCSS({
    include: PATHS.src,
    use: [options.autoprefix(), cssPreprocessorLoader]
  }),
  options.purifyCSS({
    paths: glob.sync(`${PATHS.src}/**/*.+(pug|js)`, { nodir: true }),
    styleExtensions: ['.css', '.scss']
  }),
  options.loadImages({ include: PATHS.src }),
  options.loadFonts({
    include: PATHS.src,
    options: {
      name: 'fonts/[name].[hash:8].[ext]'
    }
  }),
  options.lintJS({
    include: PATHS.src,
    options: lintJSOptions
  }),
  options.loadJS({
    include: PATHS.src,
    options: {
      cacheDirectory: true
    }
  })
]);

module.exports = () => developmentConfig;
