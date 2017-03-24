$(document).ready(function() {
  console.log("jQuery loaded");
  addEventListeners();
  refreshDOM();
});

function addEventListeners() {
  $('.addToDoForm').on('submit', addToDoSubmit);

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
      refreshDOM();
    }
  });
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
    $('#toDoList').append('<li>');
    var $el = $('#toDoList').children().last();
    $el.append('<p>').children('p').text(toDoArray[i].text);
    $el.append('<button class="Complete">Complete</button>');
    $el.append('<button class="Delete">Delete</button>');
  }
}

function populateToDoListItem (toDoObject) {

}
