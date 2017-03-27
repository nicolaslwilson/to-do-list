var toDoApplication = function () {
  var stackDo = {};

  var appendToDoList = function (toDoArray) {
    for (var i = 0; i < toDoArray.length; i++) {
      var toDoObject = toDoArray[i];
      var toDoElement = populateToDoListItem(toDoObject);
      $('#toDoList').append(toDoElement);
    }
  };

  var getToDoData = function () {
    $.ajax({
      type: 'GET',
      url: '/todo',
      success: function (response) {
        console.log(response);
        appendToDoList(response);
      }
    });
  };

  stackDo.refreshDOM = function () {
    $('#toDoList').empty();
    getToDoData();
  };

  stackDo.addToDoSubmit = function(event) {
    event.preventDefault();
    var toDoItem = $('.addToDoInput').val();
    console.log(toDoItem);
    $.ajax({
      type: 'POST',
      url: '/todo/add',
      data: {
        toDoItem: toDoItem
      },
      success: function (response) {
        console.log(response);
        $('.addToDoInput').val('');
        stackDo.refreshDOM();
      }
    });
  };

  stackDo.addToDoSubmit = function(event) {
    event.preventDefault();
    var toDoItem = $('.addToDoInput').val();
    console.log(toDoItem);
    $.ajax({
      type: 'POST',
      url: '/todo/add',
      data: {
        toDoItem: toDoItem
      },
      success: function (response) {
        console.log(response);
        $('.addToDoInput').val('');
        stackDo.refreshDOM();
      }
    });
  };

  stackDo.toggleCompleteStatus = function () {
    var $el = $(this).closest('.to-do-list-item');
    var id = $el.attr('id');
    console.log(id);
    $.ajax({
      type: 'PUT',
      url: '/todo/complete',
      data: {
        id: id
      },
      success: function (response) {
        console.log(response);
        stackDo.refreshDOM();
      }
    });
  };

  stackDo.confirmDeleteToDoItem = function () {
    var $el = $(this);
    $el.closest('.to-do-list-item').toggleClass('to-be-deleted');
    $el.next().show("slide",{
      direction: "right",
      complete: function() {

      }
    });
    $el.hide("slide",{
      direction: "right"
    });
  };

  stackDo.cancelDeleteToDoItem = function () {
    var $el = $(this).parent();
    $el.closest('.to-do-list-item').toggleClass('to-be-deleted');
    $el.hide("slide",{
      direction: "right",
      complete: function () {
        $el.prev().show("slide", {direction: "right"});
      }
    });
    console.log($el.parent().prev());

  };

  stackDo.deleteToDoItem = function () {
    var $el = $(this).closest('.to-do-list-item');
    var id = $el.attr('id');
    console.log(id);
    $.ajax({
      type: 'DELETE',
      url: '/todo/delete/' + id,
      success: function (response) {
        console.log(response);
        stackDo.refreshDOM();
      }
    });
  };

  var populateToDoListItem = function  (toDoObject) {
    var $el = $('<li>',
                {"id": toDoObject.id, "class": "complete-" + toDoObject.complete}
              )
                .addClass('pure-u-g to-do-list-item');
    $el.append(
      $('<div>')
        .addClass('pure-u-1-12')
        .append($('<form class="pure-form">')
              .append($('<input>')
                .attr('type', 'checkbox')
                .addClass('completeCheckbox')
                .prop('checked', toDoObject.complete)
              )
        )
    );
    $el.append(
      $('<p>')
        .addClass('pure-u-2-3')
        .text(toDoObject.text)
    );
    $el.append(createDeleteButtonsForToDoListItem());
    return $el;
  };

  var createDeleteButtonsForToDoListItem = function () {
    var $el = $('<div>')
      .addClass('pure-u-1-4')
      .append($('<button>')
        .text("Delete")
        .addClass('deleteButton')
        .addClass('pure-button')
      )
      .append(
        $('<div>')
        .addClass('confirmDeleteButtonContainer')
        .hide()
        .append($('<button>')
          .text("Confirm")
          .addClass('confirmDeleteButton')
          .addClass('pure-button')
        )
        .append($('<button>')
          .text("Cancel")
          .addClass('cancelDeleteButton')
          .addClass('pure-button')
        )
      );
    return $el;
  };
  return stackDo;
}();

var addEventListeners = function () {
  $('.addToDoForm').on('submit', toDoApplication.addToDoSubmit);
  $('#toDoList').on('change', '.completeCheckbox', toDoApplication.toggleCompleteStatus);
  $('#toDoList').on('click', '.deleteButton', toDoApplication.confirmDeleteToDoItem);
  $('#toDoList').on('click', '.confirmDeleteButton', toDoApplication.deleteToDoItem);
  $('#toDoList').on('click', '.cancelDeleteButton', toDoApplication.cancelDeleteToDoItem);
};

$(document).ready(function() {
  console.log("jQuery loaded");
  toDoApplication.refreshDOM();
  addEventListeners();
});
