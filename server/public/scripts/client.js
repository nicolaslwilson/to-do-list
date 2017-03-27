$(document).ready(function() {
  console.log("jQuery loaded");
  addEventListeners();
  refreshDOM();
});

function addEventListeners() {
  $('.addToDoForm').on('submit', addToDoSubmit);
  $('#toDoList').on('change', '.completeCheckbox', toggleCompleteStatus);
  $('#toDoList').on('click', '.deleteButton', confirmDeleteToDoItem);
  $('#toDoList').on('click', '.confirmDeleteButton', deleteToDoItem);
  $('#toDoList').on('click', '.cancelDeleteButton', cancelDeleteToDoItem);
}

function refreshDOM() {
  $('#toDoList').empty();
  getToDoData();
}

function getToDoData() {
  $.ajax({
    type: 'GET',
    url: '/todo',
    success: function (response) {
      console.log(response);
      appendToDoList(response);
    }
  });
}

function appendToDoList(toDoArray) {
  for (var i = 0; i < toDoArray.length; i++) {
    var toDoObject = toDoArray[i];
    var toDoElement = populateToDoListItem(toDoObject);
    $('#toDoList').append(toDoElement);
  }
}

function addToDoSubmit(event) {
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
      refreshDOM();
    }
  });
}

function toggleCompleteStatus() {
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
      refreshDOM();
    }
  });
}

function confirmDeleteToDoItem() {
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
}

function cancelDeleteToDoItem() {
  var $el = $(this).parent();
  $el.closest('.to-do-list-item').toggleClass('to-be-deleted');
  $el.hide("slide",{
    direction: "right",
    complete: function () {
      $el.prev().show("slide", {direction: "right"});
    }
  });
  console.log($el.parent().prev());

}

function deleteToDoItem() {
  var $el = $(this).closest('.to-do-list-item');
  var id = $el.attr('id');
  console.log(id);
  $.ajax({
    type: 'DELETE',
    url: '/todo/delete/' + id,
    success: function (response) {
      console.log(response);
      refreshDOM();
    }
  });
}


function populateToDoListItem (toDoObject) {
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
}

function createDeleteButtonsForToDoListItem() {
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
}
