$(document).ready(function(){
  $('.modal').modal();

  $(".button-collapse").sideNav();

  $('.parallax').parallax();

  $(".back-button").on('click', function(){
    window.history.back();
  });

  $('.tooltipped').tooltip({delay: 50});

  $('.profile-search-icons').on('click', function(e){
    e.preventDefault();
    $("#search-label").focus();
  });

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
