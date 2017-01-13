$(".back-button").on('click', function(){
  window.history.back();
});

$(document).ready(function(){
  $('.carousel').carousel();
  $('.modal').modal();
  $(".button-collapse").sideNav();
});
