$(".back-button").on('click', function(){
  window.history.back();
});

$(".add-button").on('click', function(e){
  e.preventDefault();
  console.log('add button clicked');
  var element = $(this);
  var url = element.attr('href');

  console.log('url: ', url);

  $.ajax({
    method: 'POST',
    url: url,
  }).done(function(){
    window.location = '/profile';
  });

});

$(document).ready(function(){
  $('.carousel').carousel();
  // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
  $('.modal').modal();
});
