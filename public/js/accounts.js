getUsers();

var deffn = 'First Name';
var defln = 'Last Name';
var defp = 'Password';
var defe = 'Email';
var deft = 'Select user type';

$(".dropdown-menu li a").click(function(){
    $("#dropdown-main").text($(this).text());
    $("#dropdown-main").val($(this).text());
});

function inputClick(id){
  var input = document.getElementById(id).value;
  if(input.toLowerCase() == deffn.toLowerCase() || input.toLowerCase() == defln.toLowerCase() || input.toLowerCase() == defp.toLowerCase() || input.toLowerCase() == defe.toLowerCase()){
   document.getElementById(id).value = ''; 
  }
}

function addUser(){
    var fname = document.getElementById("fname").value;
    var lname = document.getElementById("lname").value;
    var email = document.getElementById("email").value;
    var pwd = document.getElementById("pwd").value;
    var type = document.getElementById("dropdown-main").value;
   // console.log(type);

  //Check for empty first name
  if (fname == null || fname == "" || fname == deffn) {
    alert("First Name must be filled out");
    return false;
  }
  //Check for empty last name
  if (lname == null || lname == "" || lname == defln) {
    alert("Last Name must be filled out");
    return false;
  }
  //Check for empty email
  if (email == null || email == "" || email == defe) {
    alert("Email must be filled out");
    return false;
  }
  //Check for empty password
  if (pwd == null || pwd == "" || pwd == defp) {
    alert("Password must be filled out");
    return false;
  }
    //Check for empty type
  if (type == null || type == "" || type == deft) {
    alert("User type must be selected");
    return false;
  }

  if(type == 'Driver'){
    type = 0;
  }
  else{
    type = 1;
  }

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
            if(email.toLowerCase() == (data[i].email).toLowerCase()){
              exists = true;
            }        
        }
        //console.log(exists);
    },
    error: function(jqXHR, textStatus, errorThrown) {
        alert('error ' + textStatus + " " + errorThrown);    
        
    }
  });

  if (exists) {
    alert("Email already exists!");
    return false;
  }
  //console.log(type);
  //Add User to Database
  $.ajax({
    url: 'http://127.0.0.1:3000/add-user', 
    type: 'GET',
    dataType: 'json',
    data: {
        'fname': fname,
        'lname': lname,
        'email' : email,
        'pwd' : pwd,
        'tp' : type
    },
    success: function(data) {
      alert(email + " User added to Database");
      getUsers();
      document.getElementById("fname").value = deffn;
      document.getElementById("lname").value = defln;
      document.getElementById("email").value = defe;
      document.getElementById("pwd").value = defp;
      document.getElementById("dropdown-main").value = deft;
      return false;
    },
    error: function(jqXHR, textStatus, errorThrown) {
            alert('error ' + textStatus + " " + errorThrown);
      }
   });  
}

function getUsers(){
    $.ajax({
    url: 'http://127.0.0.1:3000/get-users',
    type: 'GET',
    dataType: 'json',
    success: function(data) { 
        document.getElementById("user-list").innerHTML = '';
        for(var i in data){
            var type = 'Driver'
            if(data[i].isAdmin == 1){
                type = 'Admin';
            }    
            
            document.getElementById("user-list").innerHTML = document.getElementById("user-list").innerHTML 
                                                            + '<a class="list-group-item" onclick="deleteUser(' + "'" 
                                                            + data[i].email + "'" + ')"><span class="badge"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></span>' 
                                                            + data[i].fname + ' ' + data[i].lname + ' (' + data[i].email + ') (' + type + ')</a>';
        }
    },
    error: function(jqXHR, textStatus, errorThrown) {
        alert('error ' + textStatus + " " + errorThrown);
    }
});
}

function deleteUser(email){

    $.ajax({
        url: 'http://127.0.0.1:3000/delete-user?email=' + email,    // Pass route name here through a query
        type: 'GET',
        dataType: 'json',
        success: function(data) { 
            document.getElementById("user-list").innerHTML = '';
            for(var i in data){
                var type = 'Driver'
                if(data[i].isAdmin == 1){
                    type = 'Admin';
                }   
                document.getElementById("user-list").innerHTML = document.getElementById("user-list").innerHTML 
                                                                + '<a class="list-group-item" onclick="deleteUser(' + "'" 
                                                                + data[i].email + "'" + ')"><span class="badge"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></span>' 
                                                                + data[i].fname + ' ' + data[i].lname + ' (' + data[i].email + ') (' + type + ')</a>';
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert('error ' + textStatus + " " + errorThrown);
        }
    });
};