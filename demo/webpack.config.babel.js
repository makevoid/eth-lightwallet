'use strict';

import _                  from 'lodash';
import minimist           from 'minimist';
import chalk              from 'chalk';
import webpack            from 'webpack';
import path               from 'path';

import autoprefixer       from 'autoprefixer';
import atImport           from 'postcss-import';
import customProperties   from 'postcss-custom-properties';
import extend             from 'postcss-extend';
import simpleVars         from 'postcss-simple-vars';

import HtmlWebpackPlugin  from 'html-webpack-plugin';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import ExtractTextPlugin  from 'extract-text-webpack-plugin';

const CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
const DEFAULT_TARGET     = 'BUILD';
const ROOT_PATH          = path.resolve(__dirname);
const ENV                = process.env.NODE_ENV || 'development';


const DEFAULT_PARAMS = {
  resolve: {
    extensions: ['', '.js', '.jsx'],
    root: path.resolve(ROOT_PATH, './src'),
    alias: {
      'web3':                 path.resolve(ROOT_PATH, './node_modules/web3/lib/web3.js'),
      'lightwallet':          path.resolve(ROOT_PATH, '../dist/lightwallet.min.js'),
      'hooked-web3-provider': path.resolve(ROOT_PATH, './node_modules/hooked-web3-provider/build/hooked-web3-provider.js'),
    }
  },
  entry: {
    /* Make sure that the main entry is an array, so that environment specific additions
     * are concatenated to it, instead of replacing it. */
    main: ['./src/main.jsx'],
    vendor: [
    ]
  },
  output: {
    path: path.join(__dirname, '/dist/'),
    filename: '[name].[chunkhash].js',
    sourceMapFilename: '[name].[chunkhash].map',
    publicPath: '/'
  },
  externals: {
  },
  modulesDirectories: ['node_modules', './src'],
  module: {
    loaders: [
      {test: /\.(ico|png|jpg|gif|svg|eot|ttf|woff|woff2)(\?.+)?$/, loader: 'url?limit=50000'},
      {test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader?limit=10000&minetype=application/font-woff' },
      {test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader' },
      {test: /\.jsx$/,  exclude: [/src\/vendor/, /node_modules/], loader: 'babel-loader' },
      {test: /\.js$/,   exclude: [/dist/, /src\/vendor/, /node_modules/], loader: 'babel-loader' },
      {test: /\.json$/, loader: 'json' },
      {test: /\.scss$/, loaders: ["style", "css", "sass"]}
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      },
      'NODE_ENV'     : ENV,
      '__DEV__'      : ENV === 'development',
      '__PROD__'     : ENV === 'production',
      '__DEBUG__'    : ENV === 'development' && !minimist(process.argv.slice(2)).NO_DEBUG,
      '__DEBUG_NW__' : !!minimist(process.argv.slice(2)).NW
    }),
  ],
  postcss: [
    atImport({
      path: ['node_modules', './src', './src/assets/styles']
    }),
    simpleVars(),
    autoprefixer(),
    customProperties(),
    extend()
  ],
  debug: true,
  progress: true,
  colors: true
};

let PARAMS_PER_TARGET = {

  DEV: {
    devtool: 'inline-source-map',
    entry: {
      main: 'webpack-hot-middleware/client?reload=true'
    },
    module: {
      loaders: [
        {test: /\.css$/, loader: 'style!css?importLoaders=1!postcss!sass'}
      ]
    },
    output: {
      filename: '[name].js',
      publicPath: 'http://localhost:3000/'
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new HtmlWebpackPlugin({
        template: path.resolve(ROOT_PATH, './src/index.html'),
        inject: true
      })
    ],
    devServer: {
      historyApiFallback: true
    }
  },

  BUILD: {
    debug: false,
    output: {
      path: './build'
    },
    devtool: 'source-map',
    module: {
      loaders: [
        { test: /\.css$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader!sass')  }
      ]
    },
    plugins: [
      new CleanWebpackPlugin(['build']),
      new webpack.optimize.DedupePlugin(),
      new ExtractTextPlugin('style.[hash].css', { allChunks: true }),
      new CommonsChunkPlugin( { name: 'commons', filename: 'commons.[hash].js', minChunks: Infinity } ),
      new HtmlWebpackPlugin({
        template: path.resolve(ROOT_PATH, './src/index.html'),
        inject: true,
        'assets': {
          'app': 'app.[hash].js',
          'style': 'style.[hash].css',
        }
      }),
    ]
  },

  DIST: {
    debug: false,
    module: {
      loaders: [
        { test: /\.css$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader!sass')  }
      ]
    },
    output: {
      path: './dist',
    },
    plugins: [
      new CleanWebpackPlugin(['dist']),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({
        mangle: false
      }),
      new ExtractTextPlugin('style.[hash].css', { allChunks: true }),
      new CommonsChunkPlugin( { name: 'commons', filename: 'commons.[hash].js', minChunks: Infinity } ),
      new HtmlWebpackPlugin({
        template: path.resolve(ROOT_PATH, './src/index.html'),
        inject: true,
        'assets': {
          'app': 'app.[hash].js',
          'style': 'style.[hash].css',
        }
      })
    ]
  }

};

const target  = _resolveBuildTarget(DEFAULT_TARGET);
const params  = _.merge(DEFAULT_PARAMS, PARAMS_PER_TARGET[target], _mergeArraysCustomizer);

export default params;

function _resolveBuildTarget(defaultTarget) {
    let target = minimist(process.argv.slice(2)).TARGET;
    if (!target) {
        console.log(`No build target provided, using default target ${defaultTarget} instead\n\n`);
        target = defaultTarget;
    }
    return target;
}

function _mergeArraysCustomizer(a, b) {
    if (_.isArray(a)) {
        return a.concat(b);
    }
}
