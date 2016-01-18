/**
 * Test case for nodeunitTestJsBud
 * Runs with nodeunit.
 */

var nodeunitTestJsBud = require('../lib/nodeunit_test_js_bud.js');

exports['Nodeunit testcase js bud'] = function (test) {
    var bud = nodeunitTestJsBud({
        src: __filename,
        dest: __dirname + '/../tmp'
    });
    test.ok(bud);
    test.done();
};

