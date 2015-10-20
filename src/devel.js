/**
 * Development module for running outside of BSVE.
 */
var geojs_util = require('./geojs_util'),
    data = require('./example.json');

console.log('development mode activated');

$(function () {
    // Force the search bar to be visibile
    $('.searchBar').css('top', 0);

    // pass sample search data to the plugin
    $('#map').geojs('data', 'search', geojs_util.parse_result(data));
});
