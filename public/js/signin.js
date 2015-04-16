function formSubmit(){
	//console.log($('#inputEmail').val());
	//console.log($('#inputPassword').val());
	var user = $('#inputEmail').val();
	var pwd = $('#inputPassword').val()
	var exists = false;
	//Check to see if user exists
	$.ajax({
	  url: 'http://127.0.0.1:3000/get-users',
	  type: 'GET',
	  dataType: 'json',
	  async: false,
	  success: function(data) {
	      //console.log(data);
	      for(var i in data){
	          if(user.toLowerCase() == (data[i].email).toLowerCase() && pwd == data[i].password && data[i].isAdmin == 1){
	            exists = true;
	          }        
	      }
	      //console.log(exists);
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
