const nodePath = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const isProd = process.env.NODE_ENV === 'production';
const isDev = !isProd;
const path = output => nodePath.resolve(__dirname, output);
const fileName = ext => isDev ? `bundle.${ext}` : `bundle.[hash].${ext}`;
const jsLoaders = () => {
    const loaders = [
        {
            loader: 'babel-loader',
            options: {
                presets: ['@babel/preset-env']
            }
        }
    ];

    if (isDev) {
        loaders.push('eslint-loader');
    }

    return loaders;
};

module.exports = {
    context: path('src'),
    mode: 'development',
    entry: ['@babel/polyfill', './index.js'],
    output: {
        filename: fileName('js'),
        path: path('dist'),
		    publicPath: ''
    },
    resolve: {
        extensions: ['.js'],
        alias: {
            '@': path('src'),
            '@core': path('src/core')
        }
    },
    devtool: isDev ? 'source-map' : false,
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: 'index.html',
            minify: {
                removeComments: isProd,
                collapseWhitespace: isProd
            }
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: path('src/favicon.ico'),
                    to: path('dist')
                }
            ],
        }),
        new MiniCssExtractPlugin({
            filename: fileName('css'),
        })
    ],
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader',
                ]
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: jsLoaders()
            },
            {
                test: /\.(ttf|woff|woff2|eot)$/,
                use: ['file-loader'],
            }
        ],
    },
    devServer: {
        port: 4000,
        open: true,
        hot: isDev
    },
    target: isDev ? 'web' : 'browserslist'
};
