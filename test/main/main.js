window.getInput = function () {
    return document.getElementById("input");
}; 

QUnit.test('getInput', function (assert) {
    assert.equal(typeof (window.getInput()), 'object');
    assert.equal(window.getInput().type, 'text');
});