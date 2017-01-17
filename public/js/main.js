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

    // CREATE FORM DATA OBJECT
    // var element = $(this);
    // var formData = element.serialize();

    // CREATE FORM DATA OBJECT
    var formData = {
      name: e.target.name.value,
      email: e.target.email.value,
      password: e.target.password.value,
    };

    // FIND LOCATION DETAILS BASED ON CLIENT ZIP
    $.ajax({
      method: 'GET',
      url: "https://freegeoip.net/json/?q=",
    }).done(function(locationData){

      // CREATE LOCATION AND FORM FOR DATA TO BE SENT TO SERVER
      var data = {
        locationData: locationData,
        formData: formData
      };

      var json = JSON.stringify(data);

      console.log("JSON to server", json);

      // RUN SERVER POST WITH DATA
      $.ajax({
        method: 'POST',
        url: "/auth/signup",
        data: {
          json: json
        }
      }).done(function(data){
        if (data.error) {
          // TODO: use jQuery to manually display error message as flash message.
          console.log("data.error", data.error);
          window.location = "/auth/signup";
        }
        console.log("data after ajax: ", data);

        $.ajax({
          method: 'POST',
          url: "/auth/login",
          data: formData
        }).done(function(data) {
          window.location = '/profile';
        });
      });

    });
  });

});
