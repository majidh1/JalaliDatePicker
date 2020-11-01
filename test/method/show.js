var input = window.getInput();

QUnit.test('method.show', function (assert) {
    var jpd=jalaliDatepicker(input);
    assert.equal(typeof (jpd), 'object');
    assert.ok(!jpd.shown);
    jpd.show();
    assert.ok(jpd.shown);
});