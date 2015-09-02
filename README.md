backbone.konvaview
====================

Special Backbone View for canvas via [KonvaJS](http://konvajs.github.io/) library.

[![Build Status](https://travis-ci.org/lavrton/backbone.konvaview.svg)](https://travis-ci.org/lavrton/backbone.konvaview)

`Backbove.KonvaView` allow you to work with `KonvaJS` objects in a same as `Backbone.View` works with DOM objects.
For more documentation see [Backbone.View docs](http://backbonejs.org/#View).

Example [Live preview](http://jsbin.com/fekex/5/edit?js,output):

```javascript
    var MyView = Backbone.KonvaView.extend({
      // build KonvaJS object, then return it.
      initialize : function(params) {
        this.layer = params.layer;
      },
      el : function(){
        var rect = new Konva.Rect({
          x : 100,
          y : 100,
          width : 50,
          height : 50,
          fill : 'green',
          id : 'rect'
        });
        var circle = new Konva.Circle({
          x : 200,
          y : 100,
          radius : 50,
          fill : 'red',
          name : 'circle'
        });
        var group = new Konva.Group();
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
        // this.el - cached KonvaJS object.
        this.layer.add(this.el);
        this.layer.draw();
      }
    });

    var stage = new Konva.Stage({
      container : 'container',
      width : 300,
      height : 300
    });
    var layer = new Konva.Layer();
    stage.add(layer);

    view = new MyView({layer:layer});
    view.render();
```
