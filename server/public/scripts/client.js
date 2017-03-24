$(document).ready(function() {
  console.log("jQuery loaded");
  addEventListeners();
});

function addEventListeners() {
  $('.addToDoForm').on('submit', addToDoSubmit);

}

function addToDoSubmit(event) {
  event.preventDefault();
  console.log($('.addToDoInput').val());

}
