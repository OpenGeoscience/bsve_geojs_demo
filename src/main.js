if (process && process.env && process.env.NODE_ENV !== 'production') {
    require('./devel');
    require('./geojs_util');
}

BSVE.init(function () {
    'use strict';

    var geojs = require('./geojs_util');
});
