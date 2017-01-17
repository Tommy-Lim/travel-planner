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

  // DISABLES FORM SUBMISSION TO RUN IP AND LAT/LON REQUEST FROM CLIENT, THEN RUN SERVER RQUEST
  $('#signup-form').on('submit', function(e){
    e.preventDefault();
    console.log("signup form submitted");

    // find the lat and lon of client IP
    $.ajax({
      method: 'GET',
      url: "https://freegeoip.net/json/?q=",
    }).done(function(data){

      console.log("data: ", data.zip_code);
      console.log("data: ", data.latitude);
      console.log("data: ", data.longitude);

      // run server request with lat/lon data
      $.ajax({
        method: 'POST',
        url: "/auth/signup",
        data: data
      }).done(function(data){
        console.log(data);
      });

    });
  });

});
