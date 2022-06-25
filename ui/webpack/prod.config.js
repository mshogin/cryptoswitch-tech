const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
var webpack = require('webpack');
const path = require('path');
const pkg = require('../package.json')

module.exports = {
    mode: 'production',
    entry: './src/main.js',
    module: {
        rules: [{
            test: /\.vue$/,
            exclude: /node_modules/,
            loader: 'vue-loader'
        },
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader'
                },
                {
                    test: /\.css$/,
                    use: [
                        'vue-style-loader',
                        'css-loader'
                    ]
                },
               ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
        // new webpack.optimize.CommonsChunkPlugin('common.js'),
        // new webpack.optimize.DedupePlugin(),
        // new webpack.optimize.UglifyJsPlugin(),
        // new webpack.optimize.AggressiveMergingPlugin()
    ],
    output: {
        filename: 'cryptoswitch.bundle-' + pkg.version + '.js',
        path: path.resolve(__dirname, '../www')
        // clean: true,
    }
}
