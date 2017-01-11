$("#update-user").on('click', function(e){
  e.preventDefault();

  var element = $(this);
  var url = element.attr('action');
  var data = element.serialize();

  $.ajax({
    method: 'PUT',
    url: url,
    data: data
  }).done(function(){
    window.location = '/profile/';
  });
});
