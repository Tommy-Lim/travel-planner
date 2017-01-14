$(document).ready(function(){
  $('.carousel').carousel();
  $('.modal').modal();
  $(".button-collapse").sideNav();
  $('.parallax').parallax();
  $(".back-button").on('click', function(){
    window.history.back();
  });
  $('.tooltipped').tooltip({delay: 50});
});
