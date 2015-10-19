/**
 * Development module for running outside of BSVE.
 */
var geojs_util = require('./geojs_util'),
    data = require('../py/flu.json'),
    search = geojs_util.search('#map');

$(function () {
    // Force the search bar to be visibile
    $('.searchBar').css('top', 0);

    // pass sample search data to the plugin
    search(data);
});

module.exports = true;
