require('viz/tree_map/tree_map');

var $ = require('jquery'),
    vizMocks = require('../../helpers/vizMocks.js'),
    module = require('viz/core/tooltip');

$('#qunit-fixture').append('<div id="test-container" style="width: 600px; height: 400px;"></div>');

QUnit.module('Tooltip', {
    beforeEach: function() {
        var tooltip = this.tooltip = new vizMocks.Tooltip();
        module.Tooltip = sinon.spy(function() { return tooltip; });
        this.$container = $('#test-container');
    },

    createWidget: function(options) {
        this.widget = this.$container.dxTreeMap(options).dxTreeMap('instance');
        return this.widget;
    }
});

QUnit.test('Creation', function(assert) {
    this.createWidget({
        pathModified: 'pathModified-option'
    });

    var params = module.Tooltip.lastCall.args[0];
    assert.strictEqual(params.cssClass, 'dxtm-tooltip', 'param - css class');
    assert.strictEqual(params.pathModified, 'pathModified-option', 'param - path modified');
    assert.ok(typeof params.eventTrigger === 'function', 'param - event trigger');
    assert.equal(params.widgetRoot, this.widget.element());
});

QUnit.test('Destruction', function(assert) {
    this.createWidget();

    this.$container.remove();

    assert.deepEqual(this.tooltip.dispose.lastCall.args, [], 'destroyed');
});

QUnit.test('Options', function(assert) {
    this.createWidget({
        encodeHtml: 'encode-html',
        tooltip: { color: 'red' }
    });

    assert.strictEqual(this.tooltip.update.lastCall.args[0].color, 'red', 'tooltip');
    assert.deepEqual(this.tooltip.setRendererOptions.lastCall.args[0].encodeHtml, 'encode-html', 'renderer');
});

QUnit.test('Depends on theme', function(assert) {
    var widget = this.createWidget();
    this.tooltip.update.reset();
    this.tooltip.setRendererOptions.reset();

    widget.option('theme', 'test-theme');

    assert.strictEqual(this.tooltip.update.callCount, 1, 'tooltip');
    assert.strictEqual(this.tooltip.setRendererOptions.callCount, 1, 'renderer');
});

// T279734
QUnit.test('hide tooltip on render after hide container', function(assert) {
    var widget = this.createWidget();
    this.$container.hide();

    widget.render();

    assert.deepEqual(this.tooltip.hide.lastCall.args, []);
});
