const path = require('path');
const webpack = require('webpack');
const hotMiddlewareScript = 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true';

module.exports = {
    mode: 'development',
    context: __dirname,
    resolve: {
        extensions: ['*', '.js', '.jsx', '.json', '.css'],
    },
    entry: {
        Sellev: [
            './src/Sellev/client.js',
            hotMiddlewareScript
        ]
    },
    devtool: '#source-map',
    devServer: {
        hot: true
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],
    output: {
        path: __dirname,
        filename: 'public/[name]/bundle.js',
        publicPath: '/'
    },
    // ES6 문법과 JSX 문법을 사용한다
    module: {
        rules: [
            {
                test: /(\.js|\.jsx)$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
                options: {
                    presets: [['es2015', { modules: false }], 'react'],
                    plugins: ["react-hot-loader/babel"]
                },
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            importLoaders: 1,
                            localIdentName: '[name]__[local]--[hash:base64:5]',
                        },
                    },
                ],
            },
        ],
    },
};
