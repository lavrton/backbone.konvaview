(function(root, factory) {

  if (typeof define === 'function' && define.amd) {
    define(['underscore', 'backbone', 'kinetic'], function(_, Backbone, Kinetic) {
      Backbone.KineticView = factory(root, _, Backbone, Kinetic);
      return Backbone;
    });
  } else if (typeof exports !== 'undefined') {
    var Backbone_ = require('backbone');
    Backbone_.KineticView = factory(root, require('underscore'), Backbone_, require('kinetic'));
    module.exports = Backbone_.KineticView;

  } else {
    root.Backbone.KineticView = factory(root, _, Backbone, Kinetic);

  }

}(this, function(root, _, Backbone, Kinetic) {

     var KineticView = function(options) {
      this.cid = _.uniqueId('view');
      options || (options = {});
      _.extend(this, _.pick(options, viewOptions));
      this._ensureElement();
      this.initialize.apply(this, arguments);
    };
    KineticView.extend = Backbone.Model.extend;
    var delegateEventSplitter = /^(\S+)\s*(.*)$/;
    var viewOptions = ['model', 'collection', 'el', 'id', 'attributes', 'events', 'nodeType'];

    _.extend(KineticView.prototype, Backbone.Events, {
      nodeType : 'Group',

      initialize: function(){},

      render : function(){
        return this;
      },

      remove: function() {
        this.undelegateEvents();
        this.el.destroy();
        this.stopListening();
        return this;
      },

      setElement: function(element) {
        this.undelegateEvents();
        this.el = element;
        this.delegateEvents();
        return this;
      },

      _deleteEventFromNode : function(node) {
        var _this = this;
        _.each(_.keys(node.eventListeners),function(eventType){
            node.off(eventType+'.delegateEvents' + _this.cid);
        });
      },
      undelegateEvents: function() {
        var _this = this;
        if (!this.el) {
          return this;
        }
        this._deleteEventFromNode(this.el);
        _.each(this.el.children, function(child){
          _this._deleteEventFromNode(child);
        });
        return this;
      },
      undelegate: function(eventName, selector) {
        eventName += '.delegateEvents' + this.cid;
        if (selector === '' || !selector) {
          this.el.off(eventName);
        } else {
          this.el.find && this.el.find(selector).each(function(child){
            child.off(eventName);
          });
        }
      },
      delegateEvents: function(events) {
        if (!(events || (events = _.result(this, 'events')))) return this;
        this.undelegateEvents();
        for (var key in events) {
          var method = events[key];
          if (!_.isFunction(method)) method = this[events[key]];
          if (!method) continue;
          var match = key.match(delegateEventSplitter);
          this.delegate(match[1], match[2], _.bind(method, this));
        }
        return this;
      },
      delegate: function(eventName, selector, listener) {
        // listener = selector || listener;
        eventName += '.delegateEvents' + this.cid;
        if (selector === '') {
          this.el.on(eventName, listener);
        } else if (!listener) {
          this.el.on(eventName, selector);
        } else {
          this.el.find && this.el.find(selector).each(function(child){
            child.on(eventName, listener);
          });
        }
      },
      _configure: function(options) {
        if (this.options) options = _.extend({}, _.result(this, 'options'), options);
        _.extend(this, _.pick(options, viewOptions));
        this.options = options;
      },
      _createElement: function(nodeType) {
        return new Kinetic[nodeType];
      },
      _ensureElement: function() {
        if (!this.el) {
          var attrs = _.extend({}, _.result(this, 'attributes'));
          if (this.id) attrs.id = _.result(this, 'id');
          this.setElement(this._createElement(_.result(this, 'nodeType')));
          this._setAttributes(attrs);
        } else {
          this.setElement(_.result(this, 'el'));
        }
      },
      _setAttributes: function(attributes) {
        this.el.setAttrs(attributes);
      }
    });
    return KineticView;
}));
