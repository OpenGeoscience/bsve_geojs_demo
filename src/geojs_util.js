/* global geo */

/**
 * Responds to a search request by displaying information on the map.
 * @param {object} search The search result object
 */
function search_handler(search) {
    console.log(search);
}

module.exports = {
    handlers: {
        search: search_handler
    }
};
