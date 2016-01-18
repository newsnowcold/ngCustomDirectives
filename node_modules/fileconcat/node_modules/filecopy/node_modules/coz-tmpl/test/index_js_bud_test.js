/**
 * Test case for indexJsBud
 * Runs with nodeunit.
 */

var indexJsBud = require('../lib/index_js_bud.js');

exports['Index js bud'] = function (test) {
    var bud = indexJsBud({
        dirname: __dirname
    });
    test.ok(bud);
    test.ok(bud.data.modules);
    test.done();
};
