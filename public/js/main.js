$(document).ready(function(){
  // ALLOW MODALS TO WORK - MATERIALIZE
  $('.modal').modal();

  // ALLOW SIDE NAV TO WORK - MATERIALIZE
  $(".button-collapse").sideNav();

  // ALLOW PARALLAX TO WORK - MATERIALIZE
  $('.parallax').parallax();

  // ALLOW TOOLTIPS TO WORK - MATERIALIZE
  $('.tooltipped').tooltip({delay: 50});

  // ALLOW FOR DATEPICKER - MATERIALIZE
  $('.datepicker').pickadate({
    selectMonths: true, // Creates a dropdown to control month
    selectYears: 0, // Creates a dropdown of 15 years to control year
    format: 'yyyy-mm-dd',
    min: new Date(),
    onSet: function( arg ){
        if ( 'select' in arg ){ //prevent closing on selecting month/year
            this.close();
        }
    }
  });
  $('.datepickerHistorical').pickadate({
    selectMonths: true, // Creates a dropdown to control month
    selectYears: false, // Creates a dropdown of 15 years to control year
    format: 'mmdd',
    onSet: function( arg ){
        if ( 'select' in arg ){ //prevent closing on selecting month/year
            this.close();
        }
    }
  });
  $('.datepickerProfile').pickadate({
    selectMonths: true, // Creates a dropdown to control month
    selectYears: false, // Creates a dropdown of 15 years to control year
    format: 'mmdd',
    onSet: function( arg ){
        if ( 'select' in arg ){ //prevent closing on selecting month/year
            this.close();
        }
    }
  });

  // BACK BUTTON FROM SEARCH FUNCTIONALITY
  $(".back-button").on('click', function(){
    window.history.back();
  });

  // FOCUS ON THE SEARCH BAR WHEN ADD DESTINATION CLICKED
  $('.profile-search-icons').on('click', function(e){
    e.preventDefault();
    $("#search-label").focus();
  });

  // MAKE MATERIALIZE USE CHAR COUNT ON AIRPORT CODE
  $('#destination_airport, #origin_airport').characterCounter();

  Materialize.updateTextFields();

});
