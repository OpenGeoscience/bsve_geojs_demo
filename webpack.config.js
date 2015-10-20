var webpack = require('webpack'),
    globals = {};

globals = {
/*    $: 'jquery', */ // provided by bsve
    mat4: 'gl-mat4',
    vec2: 'gl-vec2',
    vec3: 'gl-vec3',
    vec4: 'gl-vec4',
    proj4: 'proj4',
    d3: 'd3',
    pnltri: 'pnltri'
};

if (process && process.env && process.env.NODE_ENV !== 'production') {
    globals.devel = 'devel';
}

module.exports = {
    entry: [
        'webpack-hot-middleware/client',
//        'webpack/hot/only-dev-server',
        './src/main.js'
    ],
    output: {
        path: __dirname + '/geojs-test/WebContent',
        filename: 'app.js',
        publicPath: 'http://localhost:3000/'
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
            jquery: 'jquery/dist/jquery',
            geojs: 'geojs/geo.js',
            proj4: 'proj4/lib/index.js'
        }
    },
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        new webpack.ProvidePlugin(globals)
    ]
};
