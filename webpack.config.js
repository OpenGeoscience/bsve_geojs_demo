module.exports = {
    entry: './src/main.js',
    output: {
        path: __dirname + '/geojs-test/WebContent',
        filename: 'app.js',
        publicPath: '/'
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: 'style!css' },
            { test: /\.json?$/, loader: 'json' },
            { test: /\.js?$/, exclude: /node_modules/, loader: 'babel' }
        ]
    }
};
