$(document).ready(function() {

  var rect;
  var view;
  var group;

  module("Backbone.View", {

    setup: function() {
      group = new Kinetic.Group();
      rect = new Kinetic.Rect({
        id : "test"
      });
      group.add(rect);
      view = new Backbone.KineticView({el: group});
    }

  });

  test("constructor", function() {
    equal(view.$el instanceof Kinetic.Group, true);
  });

  test("initialize", 1, function() {
    var View = Backbone.KineticView.extend({
      initialize: function() {
        this.one = 1;
      }
    });

    strictEqual(new View().one, 1);
  });

  test("delegateEvents", 3, function() {
    var counter1 = 0;
    view.increment = function(){ counter1++; };

    var events = {'click #test': 'increment'};
    view.delegateEvents(events);
    rect.fire('click');
    equal(counter1, 1);

    rect.fire('click');
    equal(counter1, 2);

    view.delegateEvents(events);
    rect.fire('click');
    equal(counter1, 3);
  });

  test("delegateEvents allows functions for callbacks", 3, function() {
    view.counter = 0;

    var events = {
      click: function() {
        this.counter++;
      }
    };

    view.delegateEvents(events);
    view.$el.fire('click');
    equal(view.counter, 1);

    view.$el.fire('click');
    equal(view.counter, 2);

    view.delegateEvents(events);
    view.$el.fire('click');
    equal(view.counter, 3);
  });


  test("delegateEvents ignore undefined methods", 0, function() {
    view.delegateEvents({'click': 'undefinedMethod'});
    view.$el.fire('click');
  });

  test("undelegateEvents", 6, function() {
    var group = new Kinetic.Group();
    var rect = new Kinetic.Rect({
      name : "test"
    });
    group.add(rect);
    var view = new Backbone.KineticView({el: group});

    var counter1 = 0, counter2 = 0;
    view.increment = function(){ counter1++; };
    view.$el.on('click', function(){ counter2++; });

    var events = {'click .test': 'increment'};

    view.delegateEvents(events);
    rect.fire('click');
    equal(counter1, 1);
    equal(counter2, 1);

    view.undelegateEvents();
    rect.fire('click');
    equal(counter1, 1);
    equal(counter2, 2);

    view.delegateEvents(events);
    rect.fire('click');
    equal(counter1, 2);
    equal(counter2, 3);
  });

  test("multiple views per element", 3, function() {
    var count = 0;

    var group = new Kinetic.Group();
    var View = Backbone.KineticView.extend({
      el: group,
      events: {
        click: function() {
          count++;
        }
      }
    });

    var view1 = new View();
    group.fire("click");
    equal(1, count);

    var view2 = new View();
    group.fire("click");
    equal(3, count);

    view1.delegateEvents();
    group.fire("click");
    equal(5, count);
  });

  test("setElement uses provided object.", 3, function() {
    var el = new Kinetic.Group();

    var view = new Backbone.KineticView();
    ok(view.$el !== el);

    view.setElement(el);
    ok(view.$el === el);
    ok(view.el !== el);
  });

  test("Undelegate before changing element.", 1, function() {
    var button1 = new Kinetic.Group();
    var button2 = new Kinetic.Group();

    var View = Backbone.KineticView.extend({
      events: {
        click: function(e) {
          ok(view.$el === button2);
        }
      }
    });

    var view = new View({el: button1});
    view.setElement(button2);

    button1.fire('click');
    button2.fire('click');
  })

});
