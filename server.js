/**
 * server.js
 *
 * Node express development server for local testing of this
 * bsve application.
 */
import path from 'path';
import express from 'express';
import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import config from './webpack.config.js';

const isDeveloping = process.env.NODE_ENV !== 'production';
const port = isDeveloping ? 3000 : process.env.PORT;
const webroot = config.output.path;

const app = express();
app.use(express.static(webroot));

if (isDeveloping) {
    const compiler = webpack(config);

    app.use(webpackMiddleware(compiler, {
        publicPath: config.output.publicPath,
        contentBase: 'src',
        stats: {
            colors: true,
            hash: false,
            timings: true,
            chunks: false,
            chunkModules: false,
            modules: false
        }
    }));

    app.use(webpackHotMiddleware(compiler));
}

app.get('*', function response(req, res) {
    res.sendFile(path.join(webroot, 'index.html'));
});

app.listen(port, 'localhost', function onStart(err) {
    if (err) {
        console.log(err);
    }
    console.info('==> Listening on port %s. Open up http://localhost:%s/ in your browser.', port, port);
});