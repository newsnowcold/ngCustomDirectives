/**
 * Test case for mochaTestJsBud.
 * Runs with nodeunit.
 */

var mochaTestJsBud = require('../lib/mocha_test_js_bud.js');

exports.setUp = function(done) {
    done();
};

exports.tearDown = function(done) {
    done();
};

exports['Mocha test js bud'] = function(test){
    var bud = mochaTestJsBud({
        src: __filename,
        dest: __dirname + '/../tmp'
    });
    test.ok(bud);
    test.done();
};

