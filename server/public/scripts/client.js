$(document).ready(function() {
  console.log("jQuery loaded");
  addEventListeners();
  refreshDOM();
});

function addEventListeners() {
  $('.addToDoForm').on('submit', addToDoSubmit);
  $('#toDoList').on('change', '.completeCheckbox', toggleCompleteStatus);
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
      refreshDOM();
    }
  });
}

function toggleCompleteStatus() {
  var $el = $(this).closest('tr');
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
  var $el = $(this).closest('tr');
  var id = $el.attr('id');
  console.log(id);
  if (confirm("Are you sure you want to delete this item?")) {
    $.ajax({
      type: 'DELETE',
      url: '/todo/delete/' + id,
      success: function (response) {
        console.log(response);
        refreshDOM();
      }
    });
  }
}


function populateToDoListItem (toDoObject) {
  var $el = $('<tr>', {"id": toDoObject.id, "class": toDoObject.complete});
  $el.append($('<td>')
        .append($('<form class="pure-form">')
              .append($('<input>')
                .attr('type', 'checkbox')
                .addClass('completeCheckbox')
                .prop('checked', toDoObject.complete)
              )
        )
  );
  $el.append(
    $('<td>')
      .text(toDoObject.text)
  );
  $el.append($('<td>')
              .append($('<button>')
                .text("Delete")
                .addClass('delete')
                .addClass('pure-button')
              )
  );
  return $el;
}
