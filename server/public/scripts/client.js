//An IIFE which returns an object containing the public properties of the stackDo SPA.
var toDoApplication = function () {
  //This object will be returned from the IIFE
  var stackDo = {};

  //A private method used by RefreshDOM to append to do list items to the page
  var appendToDoList = function (toDoArray) {
    for (var i = 0; i < toDoArray.length; i++) {
      var toDoObject = toDoArray[i];
      var toDoElement = populateToDoListItem(toDoObject);
      $('#toDoList').append(toDoElement);
    }
  };

  //Sends a get request to the server.
  //Expects an array of toDoObjects as the response.
  var getToDoData = function () {
    $.ajax({
      type: 'GET',
      url: '/todo',
      success: function (response) {
        // console.log(response);
        appendToDoList(response);
      }
    });
  };

  //Takes a jQuery element as an argument.
  //Returns the ID of the list item that contains that element.
  var getToDoID = function ($listItemChild) {
    //Find the parent element for this to do item
    var $el = $listItemChild.closest('.to-do-list-item');
    //Store the ID of this to do item to be sent to the server
    var id = $el.attr('id');
    return id;
  };

  //Empty the toDoList element and fill it with the data from the server
  stackDo.refreshDOM = function () {
    $('#toDoList').empty();
    getToDoData();
  };


  //Sends a POST request to the server to add a new to do item to the database
  //The request sends only a string, the server will populate the other properties automatically
  stackDo.addToDoSubmit = function(event) {
    event.preventDefault();
    var $el = $(this);
    var toDoItem = $('.addToDoInput').val();
    //Prevent further requests from being made until after a response is received
    $(this).attr("disabled", "disabled");
    $el.addClass('pure-button-disabled');
    //Send the to do item to the server in a POST request
    $.ajax({
      type: 'POST',
      url: '/todo/add',
      data: {
        toDoItem: toDoItem
      },
      success: function (response) {
        // console.log(response);
        //Since the request was successful we can reset the input field
        $('.addToDoInput').val('');
        //The submit button can be re-enabled.
        $el.removeAttr('disabled');
        $el.removeClass('pure-button-disabled');
        //Refresh the page with the updated information.
        stackDo.refreshDOM();
      }
    });
  };

  //Allows user to toggle the complete status for a to do list item
  //Sends a put request to the server with an to do item ID
  //The server toggles the complete status for that to do item in the database
  stackDo.toggleCompleteStatus = function () {
    //Get ID of this list item
    var id = getToDoID($(this));
    $.ajax({
      type: 'PUT',
      url: '/todo/complete',
      data: {
        id: id
      },
      success: function (response) {
        // console.log(response);
        stackDo.refreshDOM();
      }
    });
  };

  //Display buttons to confirm whether or not the user intends to delete the to do item
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

  //Cancel deletion and restore original delete button.
  stackDo.cancelDeleteToDoItem = function () {
    var $el = $(this).parent();
    $el.closest('.to-do-list-item').toggleClass('to-be-deleted');
    $el.hide("slide",{
      direction: "right",
      complete: function () {
        $el.prev().show("slide", {direction: "right"});
      }
    });
  };

  //After a user has confirmed deletion, send a DELETE request to the server
  stackDo.deleteToDoItem = function () {
    //Get ID of this list item
    var id = getToDoID($(this));
    $.ajax({
      type: 'DELETE',
      url: '/todo/delete/' + id,
      success: function (response) {
        // console.log(response);
        stackDo.refreshDOM();
      }
    });
  };

  //Takes an object with an id, text and boolean complete property
  //Returns a list item element populated with data from the toDoObject
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

  //Called by populateToDoListItem
  //Creates buttons to allow user to delete individual to do items
  var createDeleteButtonsForToDoListItem = function () {
    var $el = $('<div>')
      .addClass('pure-u-1-4')
      .addClass('delete-buttons-container')
      //Adds delete button
      .append($('<button>')
        .text("Delete")
        .addClass('deleteButton')
        .addClass('pure-button')
      )
      //These buttons are hidden when the page loads.
      //When a user clicks the delete button they are shown to confirm deletion
      .append(
        $('<div>')
        .addClass('confirm-delete-button-container')
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
  //Return the object containing the to do application.
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
  console.log("Welcome to StackDo: A Full Stack To Do SPA! :)");
  addEventListeners();
  toDoApplication.refreshDOM();
});
