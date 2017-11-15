		$('#company-name').html(getCookie('company'));	
		$('#value').html(getCookie('val'));
		$('#type').html(getCookie('type'));
		$('#username').html(getCookie('username'));
		$('#credits').html(getCookie('credits') + ' credits');
		document.getElementById('quantity').max=Math.floor(parseInt(getCookie('credits'))/parseFloat(getCookie('val')));

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function transact(){
	$.ajax({
		type: "POST",
                url: 'http://pollithy.com:8000/transaction/',
                data: {
                  'quantity': getCookie('type')=='buy'? 1 : -1 * (document.getElementById('quantity').value == "" ? 1 : parseInt(document.getElementById('quantity').value)),
                  'company_id': getCookie('company_id'),
                  'value_at_buy':getCookie('val'),
                  'user_id':getCookie('user_id'),
                  'block_address':  getCookie('transactionReply')
                },
                success: function(data){
                  if (!data.error){
                  document.cookie="credits="+data.credit;
                  window.location="/waterfriendlinessindex/truffle/src/portfolio.html";
                  }
                  else {
                    window.location="/waterfriendlinessindex/truffle/src/userLanding.html";
                  }
                }
	})
}