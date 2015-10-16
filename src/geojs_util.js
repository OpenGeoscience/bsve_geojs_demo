var geo_data_store = 'geo',
    $ = require('jquery'),
    geo = require('geojs');

/**
 * This object contains methods that are callable from the
 * jquery plugin.  I.e.
 *
 *   $(node).geojs('data', arg1, arg2, ...) -> geo_mathods(arg1, arg2, ...);
 */
var geo_methods = {
    /**
     * Get/set data from the map instance.
     */
    data: function (name, data) {
        var geoData = $(this).data(geo_data_store);
        if (data === undefined) {
            return geoData[name];
        }
        geoData[name] = data;
    }
};

/**
 * Responds to a search request by displaying information on the map.
 * @param {object} search The search result object
 */
function make_search_handler(node) {
    var $el = $(node);
    $el.geojs();

    return function handler(search) {
        $el.geojs('data', 'search', search);
        console.log(search);
    };
}

/**
 * Create a simple jquery plugin to initialize a map on a node.
 * The `this` context should be the DOM element.
 */
$.fn.geojs = function (method) {
    var $this = $(this),
        geoData = $this.data(geo_data_store) || {},
        map = geoData.map,
        osm = geoData.osm,
        layer = geoData.layer,
        point = geoData.points;

    // Initialize the map on first call
    if (!map) {
        map = geo.map({node: this});
        geoData.map = map;
        osm = null;
    }

    if (!osm) {
        osm = map.createLayer('osm');
        geoData.osm = osm;
        layer = null;
    }

    if (!layer) {
        layer = map.createLayer('feature');
        geoData.layer = layer;
        point = null;
    }

    if (!point) {
        point = layer.createFeature('point');
        geoData.point = point;
    }

    if (geo_methods.hasOwnProperty(method)) {
        geo_methods[method].apply(this, arguments.slice(1));
    } else if (method) {
        throw new Error('Unknown method "' + method + '"');
    }

    // Store the objects on the node
    $this.data(geo_data_store, geoData);
};

module.exports = {
    search: make_search_handler
};
