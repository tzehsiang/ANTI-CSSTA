window.fbAsyncInit = function() {
  FB.init({
    appId: '258834627467776',
    status: true,
    xfbml: true
  });

  $('#login-fb').on('click', function() {
    console.log(FB.getLoginStatus());
    FB.login(function(response) {
      if (response.authResponse) {
        console.log('Welcome!  Fetching your information.... ');
        FB.api('/search',{q: '%23測試一下下大家拍謝', type: 'post'}, function(response) {
          //console.log('Good to see you, ' + response + '.');
          console.log(response);
        });
      } else {
        console.log('User cancelled login or did not fully authorize.');
      }
    });
  })
  // debugger;
  // FB.login(function(){
  //   debugger;
  //   FB.api('/search', {q: 'last_name',type:'post'}, function(response) {
  //     debugger;
  //     console.log(response);
  //   });
  // }, {scope: 'publish_actions'})
};