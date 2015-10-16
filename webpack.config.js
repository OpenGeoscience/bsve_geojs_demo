var webpack = require('webpack'),
    BowerWebpackPlugin = require('bower-webpack-plugin');

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
            { test: /\.js?$/, exclude: /node_modules/, loader: 'babel' },
            {
                test: /geo.js$/,
                loader: 'imports?this=>window'
            }
        ]
    },
    resolve: {
        alias: {
            jquery: 'jquery/src/jquery',
            geojs: 'geojs/geo.js',
            proj4: 'proj4/lib/index.js'
        }
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            mat4: 'gl-mat4',
            vec2: 'gl-vec2',
            vec3: 'gl-vec3',
            vec4: 'gl-vec4',
            proj4: 'proj4',
            d3: 'd3'
        })
    ]
};
