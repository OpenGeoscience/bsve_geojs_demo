var geo_data_store = 'geo';

require('geojs');

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
        var geoData = this.data(geo_data_store) || {};
        if (data === undefined) {
            return geoData[name];
        }
        geoData[name] = data;
        this.geojs('update');
    },

    /**
     * Redraw the map.
     */
    update: function () {
        var data = this.geojs('data', 'search'),
            point = this.geojs('data', 'point'),
            map = this.geojs('data', 'map');

        if (point) {
            point.data(data);
            map.draw();
        }
    }
};

/**
 * Responds to a search request by displaying information on the map.
 * @param {object} node The dom node to display the result on
 */
function make_search_handler(node) {
    return function handler(query) {
        var $el = $(node);

        // Perform the query
        var filter = encodeURI('dateTime ge ' + query.startDate + ' and dateTime le ' + query.endDate);
        BSVE.api.datasource.query('PON', filter, null, null, function (searchid) {
            /**
             * A polling method that waits until the search is complete and draws
             * the results on the map.
             */
            function poll(result) {
                var stat = parseInt(result.status);
                if (stat === 0) {
                    window.setTimeout(
                        function () {
                            BSVE.api.datasource.result(searchid, poll, onerror);
                        },
                        500
                    );
                } else if (stat === -1) {
                    onerror();
                } else {
                    $el.geojs('data', 'search', process_search(result));
                    done();
                }
            }

            function onerror() {
                console.log('Could not complete search ' + searchid);
                done();
            }

            function done() {
                // show the search bar maybe...
                // BSVE.ui.searchbar.show();
            }

            poll({status: 0});
        });
    };
}

/**
 * Process a search result coming from the BSVE.
 * @param {object} result The search result object.
 * @returns obect[] An array of point data
 */
function process_search(result) {
    return result.result.filter(function (d) {
        return d.longitude && d.latitude;
    }).map(function (d) {
        $.extend(d, {
            x: parseFloat(d.longitude),
            y: parseFloat(d.latitude)
        });
        return d;
    });
}

/**
 * Display the results of a search query on the map.
 */
function display_results() {
}

/**
 * Create a simple jquery plugin to initialize a map on a node.
 * The `this` context should be the DOM element.
 */
$.fn.geojs = function (method) {
    var $this = this,
        geoData = $this.data(geo_data_store) || {},
        map = geoData.map,
        osm = geoData.osm,
        layer = geoData.layer,
        point = geoData.points;

    // Store the objects on the node
    $this.data(geo_data_store, geoData);

    // Initialize the map on first call
    if (!map) {
        map = geo.map({node: this, zoom: 2});
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
        return geo_methods[method].apply(
            this,
            Array.prototype.slice.call(arguments, 1)
        );
    } else if (method) {
        throw new Error('Unknown method "' + method + '"');
    }
};

module.exports = {
    search: make_search_handler,
    parse_result: process_search
};
