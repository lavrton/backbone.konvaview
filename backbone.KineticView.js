(function(){

     Backbone.KineticView = function(options) {
      this.cid = _.uniqueId('view');
      this._configure(options || {});
      this._ensureElement();
      this.delegateEvents();
      this.initialize.apply(this, arguments);
    };
    Backbone.KineticView.extend = Backbone.Model.extend;
    var delegateEventSplitter = /^(\S+)\s*(.*)$/;
    var viewOptions = ['model', 'collection', 'el', 'attributes', 'events'];

    _.extend(Backbone.KineticView.prototype, Backbone.Events, {
      initialize: function(){},
      el : function(){
        return new Kinetic.Group();
      },
      render : function(){
        return this;
      },
      remove: function() {
        this.$el.destroy();
        this.stopListening();
        return this;
      },
      setElement: function(element, delegate) {
        if (this.$el) this.undelegateEvents();
        this.$el = element;
        if (delegate !== false) this.delegateEvents();
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
        this._deleteEventFromNode(this.$el);
        _.each(this.$el.children,function(child){
          _this._deleteEventFromNode(child);
        });
        return this;
      },
      delegateEvents: function(events) {
        if (!(events || (events = _.result(this, 'events')))) return this;
        this.undelegateEvents();
        for (var key in events) {
          var method = events[key];
          if (!_.isFunction(method)) method = this[events[key]];
          if (!method) continue;

          var match = key.match(delegateEventSplitter);
          var eventName = match[1], selector = match[2];
          method = _.bind(method, this);
          eventName += '.delegateEvents' + this.cid;

          if (selector === '') {
            this.$el.on(eventName, method);
          } else {
            this.$el.get(selector).each(function(child){
              child.on(eventName, method);
            });
          }
        }
        return this;
      },
      _configure: function(options) {
        if (this.options) options = _.extend({}, _.result(this, 'options'), options);
        _.extend(this, _.pick(options, viewOptions));
        this.options = options;
      },
      _ensureElement: function() {
        if (!this.el) {
          var $el = new Kinetic.Group();
          this.setElement($el, false);
        } else {
          this.setElement(_.result(this, 'el'), false);
        }
      }
    });

}).call(this);
