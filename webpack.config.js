var webpack = require('webpack'),
    globals = {}, entry, plugins;

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
    console.log('Building for local development');
    entry = [
        'webpack-hot-middleware/client',
        'webpack/hot/dev-server',
        './src/devel.js'
    ];
    plugins = [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        new webpack.ProvidePlugin(globals)
    ];
} else {
    console.log('Building for remote deployment');
    plugins = [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.ProvidePlugin(globals)
    ];
    entry = ['./src/main.js'];
}


module.exports = {
    entry: entry,
    output: {
        path: __dirname + '/geojs-test/WebContent',
        filename: 'app.js'
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
    plugins: plugins
};
