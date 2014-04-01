backbone.kineticview
====================

Special Backbone View for canvas via [KineticJS](http://kineticjs.com/) library.

[![Build Status](https://travis-ci.org/slash-system/backbone.kineticview.svg)](https://travis-ci.org/slash-system/backbone.kineticview)

Example:

```javascript
    var MyView = Backbone.KineticView.extend({
      // build Kineticjs object, then return it.
      el : function(){
        var rect = new Kinetic.Rect({
          x : 100,
          y : 100,
          width : 50,
          height : 50,
          fill : 'green',
          id : 'rect'
        });
        var circle = new Kinetic.Circle({
          x : 200,
          y : 100,
          radius : 50,
          fill : 'red',
          name : 'circle'
        });
        var group = new Kinetic.Group();
        group.add(rect).add(circle);
        return group;
      },
      // setup events
      events : {
        'click #rect' : function(){
          console.log("on rectangle clicked");
        },
        'mouseover .circle' : 'onMouseOverCircle'
      },
      onMouseOverCircle : function(){
        console.log('Mouse is over circle');
      },
      render : function(){
        // this.$el - cached kineticjs object.
        this.options.layer.add(this.$el);
        layer.draw();
      }
    });

    var stage = new Kinetic.Stage({
      container : 'container',
      width : 300,
      height : 300
    });
    var layer = new Kinetic.Layer();
    stage.add(layer);

    view = new MyView({layer:layer});
    view.render();
```
