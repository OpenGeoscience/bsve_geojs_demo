/* global BSVE */
BSVE.init(function () {
    'use strict';

    var geojs = require('./geojs_util');

    BSVE.api.search.submit(geojs.handlers.search);
});
