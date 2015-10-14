module.exports = {
    entry: './src/main.js',
    output: {
        path: __dirname + '/geojs-test/WebContent',
        filename: 'app.js'
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: 'style!css' }
        ]
    }
};
