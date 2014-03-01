/**
FB.init
703881722986326
*/

// Initialize DK StackMob
StackMob.init({
  publicKey: "bc0f3b38-1460-4521-b671-42bf08062c2f",
  apiVersion: 0
});

// Keep app self-contained
var myApp = (function($) {

  var Todo = StackMob.Model.extend({
    schemaName: 'todo'
  });

  var Todos = StackMob.Collection.extend({
    model: Todo
  });

  var HomeView = Backbone.View.extend({

    initialize: function() {
      this.collection.bind('change', this.render, this);
      homeTemplate = _.template($('#home').html());
      listTemplate = _.template($('#listTemplate').html());
    },

    render: function(eventName) {
      var collection = this.collection,
        listContainer = $('<ul data-role="listview" id="todoList"></ul>');

      // Render the page template
      $(this.el).html(homeTemplate());

      // Find the content area for this page
      var content = $(this.el).find(":jqmData(role='content')");
      content.empty();

      // loop over our collection and use a template to write out
      // each of the items to a jQuery Mobile listview contianer
      collection.each(function(model) {
        listContainer.append(listTemplate(model.toJSON()));
      });

      // Append our todo list to the content area.
      content.append(listContainer);

      return this;
    }
  });

  var AddView = Backbone.View.extend({
    events: {
      "submit form": "add"
    },

    initialize: function() {
      this.router = this.options.router;
      this.collection = this.options.collection;
      this.template = _.template($('#add').html());
    },

    render: function() {
      $(this.el).html(this.template());
      return this;
    },

    add: function(e) {
      e.preventDefault();
      var item = $('#addForm').serializeObject(),
        collection = this.collection,
        router = this.router;

      // Create a new instance of the todo model and populate it
      // with your form data.
      var todo = new Todo(item);

      // Call the create method to save your data at stackmob
      todo.create({
        success: function(model, result, options) {

          // Add new item to your collection
          collection.add(model);

          // Send a change event to our collection so the
          // list of todos is refreshed on our homepage.
          collection.trigger('change');

          // Return back to the home page
          router.navigate('#', {
            trigger: true,
            replace: false
          });
        }
      });

      return this;
    }
  });

  var UpdateView = Backbone.View.extend({
    events: {
      "click #updateBtn": "update",
      "click #deleteBtn": "destroy"
    },

    initialize: function() {
      this.router = this.options.router;
      this.model = this.options.model;
      this.collection = this.collection;
      this.template = _.template($('#update').html());
    },

    render: function() {
      $(this.el).html(this.template(this.model.toJSON()));
      return this;
    },

    update: function(e) {
      e.preventDefault();

      var item = $('#updateForm').serializeObject(),
        collection = this.collection,
        router = this.router;
      console.log(item);
      console.log(this.model);
      this.model.save(item, {
        success: function(model, result, options) {
          // Return back to the home page
          router.navigate('#', {
            trigger: true,
            replace: false
          });
        }
      });
    },

    destroy: function(e) {
      e.preventDefault();

      var collection = this.collection,
        router = this.router;

      this.model.destroy({
        success: function(model, result, options) {
          router.navigate('#', {
            trigger: true,
            replace: false
          });
        },
        error: function(model, result, options) {
          console.log(result);
        }
      });
    }
  });

  var AppRouter = Backbone.Router.extend({
    routes: {
      "": "home",
      "add": "add",
      "update/:id": "update"
    },

    initialize: function(options) {
      // Handle back button throughout the application
      $('.back').on('click', function(event) {
        window.history.back();

        return false;
      });
      this.firstPage = true;
      this.collection = options.collection;
    },

    home: function() {
      this.changePage(new HomeView({
        collection: this.collection
      }), true);
    },

    add: function() {
      this.changePage(new AddView({
        collection: this.collection,
        router: this
      }), false);
    },

    update: function(e) {
      model = this.collection.get(e);
      this.changePage(new UpdateView({
        collection: this.collection,
        router: this,
        model: model
      }), false);
    },

    changePage: function(page, reverse) {
      $(page.el).attr('data-role', 'page');
      page.render();
      $('body').append($(page.el));

      var transition = $.mobile.defaultPageTransition;
      // We don't want to slide the first page
      if (this.firstPage) {
        transition = 'none';
        this.firstPage = false;
      }

      $.mobile.changePage($(page.el), {
        changeHash: false,
        transition: transition,
        reverse: reverse
      });
    }
  });

  var initialize = function() {
    var todos = new Todos();
    todos.fetch({
      async: false
    });

    var app_router = new AppRouter({
      collection: todos
    });
    Backbone.history.start();
  };

  return {
    initialize: initialize
  };

}(jQuery));

// When the DOM is ready
$(document).ready(function() {
  myApp.initialize();
});

$.fn.serializeObject = function() {
  var o = {};
  var a = this.serializeArray();
  $.each(a, function() {
    if (o[this.name] !== undefined) {
      if (!o[this.name].push) {
        o[this.name] = [o[this.name]];
      }
      o[this.name].push(this.value || '');
    } else {
      o[this.name] = this.value || '';
    }
  });
  return o;
};

