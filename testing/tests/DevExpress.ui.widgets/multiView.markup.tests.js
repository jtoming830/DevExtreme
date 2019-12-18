var $ = require('jquery');

require('ui/multi_view');

QUnit.testStart(function() {
    var markup =
        '<div id="container">\
            <div id="multiView"></div>\
        </div>\
        <div id="container3">\
            <div id="customMultiViewWithTemplate">\
            </div>\
            <div id="template1"><p>Test1</p></div>\
            <div id="template2"><p>Test2</p></div>\
        </div>';

    $('#qunit-fixture').html(markup);
});

var MULTIVIEW_CLASS = 'dx-multiview',
    MULTIVIEW_WRAPPER_CLASS = 'dx-multiview-wrapper',
    MULTIVIEW_ITEM_CONTAINER_CLASS = 'dx-multiview-item-container',

    MULTIVIEW_ITEM_CLASS = 'dx-multiview-item',
    MULTIVIEW_ITEM_CONTENT_CLASS = 'dx-multiview-item-content',
    MULTIVIEW_ITEM_HIDDEN_CLASS = 'dx-multiview-item-hidden';

var toSelector = function(cssClass) {
    return '.' + cssClass;
};

QUnit.module('markup');

QUnit.test('widget should be rendered', function(assert) {
    var $multiView = $('#multiView').dxMultiView();

    assert.ok($multiView.hasClass(MULTIVIEW_CLASS), 'widget class added');
});

QUnit.test('wrapper should be rendered', function(assert) {
    var $multiView = $('#multiView').dxMultiView(),
        $wrapper = $multiView.children(toSelector(MULTIVIEW_WRAPPER_CLASS));

    assert.equal($wrapper.length, 1, 'wrapper was rendered');
});

QUnit.test('item container should be rendered', function(assert) {
    var $multiView = $('#multiView').dxMultiView(),
        $wrapper = $multiView.children(toSelector(MULTIVIEW_WRAPPER_CLASS)),
        $itemContainer = $wrapper.children(toSelector(MULTIVIEW_ITEM_CONTAINER_CLASS));

    assert.equal($itemContainer.length, 1, 'item container was rendered');
});

QUnit.test('items should be rendered', function(assert) {
    var $multiView = $('#multiView').dxMultiView({
            items: [1, 2],
            selectedIndex: 0
        }),
        $itemContainer = $multiView.find(toSelector(MULTIVIEW_ITEM_CONTAINER_CLASS)),
        $items = $itemContainer.children(toSelector(MULTIVIEW_ITEM_CLASS));

    assert.equal($items.length, 2, 'items was rendered');
    assert.equal($items.eq(0).find(toSelector(MULTIVIEW_ITEM_CONTENT_CLASS)).length, 1, 'rendered item has item content inside');
    assert.equal($items.eq(1).find(toSelector(MULTIVIEW_ITEM_CONTENT_CLASS)).length, 0, 'second item has no item content because deferRendering is true');
});

QUnit.test('item templates should be applied', function(assert) {
    var $multiView = $('#customMultiViewWithTemplate').dxMultiView({
            items: [{ template: $('#template1') }, { template: $('#template2') }],
            selectedIndex: 1,
            deferRendering: false
        }),
        $itemContainer = $multiView.find(toSelector(MULTIVIEW_ITEM_CONTAINER_CLASS)),
        $items = $itemContainer.children(toSelector(MULTIVIEW_ITEM_CLASS));

    assert.equal($items.eq(0).text(), 'Test1', 'element has correct content');
    assert.equal($items.eq(1).text(), 'Test2', 'element has correct content');
});

QUnit.test('inner multiview items should not be overlapped by nested multiview items', function(assert) {
    var $multiView = $('#multiView').dxMultiView({
            items: [1, 2, 3, 4],
            selectedIndex: 3,
            itemTemplate: function() {
                return $('<div>').dxMultiView({
                    items: [1, 2]
                });
            }
        }),
        $itemContainer = $multiView.find(toSelector(MULTIVIEW_ITEM_CONTAINER_CLASS));

    var $items = $itemContainer.children(toSelector(MULTIVIEW_ITEM_CLASS));
    assert.ok(!$items.eq(3).hasClass(MULTIVIEW_ITEM_HIDDEN_CLASS), 'correct item selected');
});

QUnit.test('only selected item should be visible', function(assert) {
    var $multiView = $('#multiView').dxMultiView({
            items: [1, 2, 3],
            selectedIndex: 0
        }),
        $items = $multiView.find(toSelector(MULTIVIEW_ITEM_CLASS));

    assert.ok(!$items.eq(0).hasClass(MULTIVIEW_ITEM_HIDDEN_CLASS));
    assert.ok($items.eq(1).hasClass(MULTIVIEW_ITEM_HIDDEN_CLASS));
    assert.ok($items.eq(2).hasClass(MULTIVIEW_ITEM_HIDDEN_CLASS));
});

QUnit.test('item containers should be rendered if deferRendering is true', function(assert) {
    var $element = $('#multiView').dxMultiView({
        items: [
            { text: 'Greg' },
            { text: '31' },
            { text: 'Charlotte' },
            { text: 'programmer' }
        ],
        selectedIndex: 0,
        deferRendering: true
    });

    assert.equal($element.find('.' + MULTIVIEW_ITEM_CLASS).length, 4, 'containers rendered');
});

QUnit.module('aria accessibility');

QUnit.test('aria role for each item', function(assert) {
    var $multiView = $('#multiView').dxMultiView({ items: [1, 2] }),
        $item = $multiView.find('.dx-item:first');

    assert.equal($item.attr('role'), 'tabpanel');
});

QUnit.test('inactive item should have aria-hidden attribute', function(assert) {
    var $element = $('#multiView').dxMultiView({
            items: [1, 2],
            selectedIndex: 0,
            animationEnabled: false
        }),
        $item0 = $element.find('.dx-multiview-item:eq(0)'),
        $item1 = $element.find('.dx-multiview-item:eq(1)');

    assert.equal($item0.attr('aria-hidden'), undefined, 'aria-hidden does not exist for 1st item');
    assert.equal($item1.attr('aria-hidden'), 'true', 'aria-hidden is true for 2nd item');
});
