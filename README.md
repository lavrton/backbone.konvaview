backbone.konvaview
====================

Special Backbone View for canvas via [KonvaJS](http://konvajs.github.io/) library.

[![Build Status](https://travis-ci.org/slash-system/backbone.konvaview.svg)](https://travis-ci.org/slash-system/backbone.konvaview)

Example [Live preview](http://jsbin.com/fekex/4/edit):

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
