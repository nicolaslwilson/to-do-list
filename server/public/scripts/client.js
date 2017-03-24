$(document).ready(function() {
  console.log("jQuery loaded");
  addEventListeners();
  refreshDOM();
});

function addEventListeners() {
  $('.addToDoForm').on('submit', addToDoSubmit);
  $('#toDoList').on('click', '.complete', toggleCompleteStatus);
  $('#toDoList').on('click', '.delete', deleteToDoItem);
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
    $('#toDoList').append('<li id="' + toDoObject.id + '" class="' + toDoObject.complete + '">');
    var $el = $('#toDoList').children().last();
    $el.append('<p>').children('p').text(toDoObject.text);
    $el.append('<button class="complete">Complete</button>');
    $el.append('<button class="delete">Delete</button>');
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
      refreshDOM();
    }
  });
}

function toggleCompleteStatus() {
  var $el = $(this).closest('li');
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

function deleteToDoItem() {
  var $el = $(this).closest('li');
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

}
