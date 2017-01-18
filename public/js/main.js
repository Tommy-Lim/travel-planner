$(document).ready(function(){
  // ALLOW MODALS TO WORK - MATERIALIZE
  $('.modal').modal();

  // ALLOW SIDE NAV TO WORK - MATERIALIZE
  $(".button-collapse").sideNav();

  // ALLOW PARALLAX TO WORK - MATERIALIZE
  $('.parallax').parallax();

  // ALLOW TOOLTIPS TO WORK - MATERIALIZE
  $('.tooltipped').tooltip({delay: 50});

  // BACK BUTTON FROM SEARCH FUNCTIONALITY
  $(".back-button").on('click', function(){
    window.history.back();
  });

  // FOCUS ON THE SEARCH BAR WHEN ADD DESTINATION CLICKED
  $('.profile-search-icons').on('click', function(e){
    e.preventDefault();
    $("#search-label").focus();
  });

});
