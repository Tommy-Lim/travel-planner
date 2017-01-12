$(".back-button").on('click', function(){
  window.history.back();
});

$(document).ready(function(){
  $('.carousel').carousel();
  // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
  $('.modal').modal();
});
