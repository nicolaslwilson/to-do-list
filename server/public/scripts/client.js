$(document).ready(function() {
  console.log("jQuery loaded");
  addEventListeners();
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
      console.log(response);
    }
  });
}
