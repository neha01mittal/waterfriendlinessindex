  $(document).ready(function(){
        $('.log-btn').click(function(){
          if(document.getElementById("password").value == 'waterfriend'){
              $('.log-status').removeClass('wrong-entry');
              $.ajax({
                type: "POST",
                url: 'http://df482d16.ngrok.io/companylogin/',
                data: {
                  'company_name': document.getElementById("username").value
                },
                success: function(data){
                  console.log(data);
                  document.cookie = 'company_id='+data.company_id;
                  document.cookie = 'company_name='+document.getElementById("username").value;
                  window.location='/companyLanding.html';
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