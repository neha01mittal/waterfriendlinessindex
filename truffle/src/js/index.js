  $(document).ready(function(){
        $('.log-btn').click(function(){
          if(document.getElementById("password").value == 'waterfriend'){
              $('.log-status').removeClass('wrong-entry');
              $.ajax({
                type: "POST",
                url: 'http://pollithy.com:8000/userlogin/',
                data: {
                  'user_name': document.getElementById("username").value
                },
                success: function(data){
                  document.cookie = 'user_id='+data.user_id;
                  document.cookie = 'credits='+data.credit;
                  document.cookie = 'username='+document.getElementById("username").value;
                  window.location='/waterfriendlinessindex/truffle/src/userLanding.html';
                }
              });
            }
            else{
            $('.log-status').addClass('wrong-entry');
           $('.alert').fadeIn(500);
           setTimeout( "$('.alert').fadeOut(1500);",3000 );
         }
        });
    });