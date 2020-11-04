var input = window.getInput();

input.addEventListener("show.jalalidatepicker", function (e) {
    QUnit.test('events.show', function (assert) {
        assert.equal(e.type, 'show.jalalidatepicker');
    });
});