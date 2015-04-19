var ip = '104.197.3.201';

function formSubmit(){
	var user = $('#inputEmail').val();
	var pwd = $('#inputPassword').val()
	var exists = false;
	//Check to see if user exists
	$.ajax({
	  url: 'http://' + ip + ':3000/get-users',
	  type: 'GET',
	  dataType: 'json',
	  async: false,
	  success: function(data) {
	      for(var i in data){
	          if(user.toLowerCase() == (data[i].email).toLowerCase() && pwd == data[i].password && data[i].isAdmin == 1){
	            exists = true;
	          }        
	      }
	  },
	  error: function(jqXHR, textStatus, errorThrown) {
	      alert('error ' + textStatus + " " + errorThrown);    
	      
	  }
	});

	if (!exists) {
	  alert("Invalid username or password!");
	  return false;
	}
	else{
		window.location.href = "dash.html";
	}
}
