getUsers();

var ip = '104.197.3.201';
var deffn = 'First Name';
var defln = 'Last Name';
var defp = 'Password';
var defe = 'Email';
var deft = 'Select user type';
var photoName = '';

$(".dropdown-menu li a").click(function(){
    $("#dropdown-main").text($(this).text());
    $("#dropdown-main").val($(this).text());
});

function toPassword(){
  document.getElementById('pwd').type = 'password';
}

function inputClick(id){
  var input = document.getElementById(id).value;
  if(input.toLowerCase() == deffn.toLowerCase() || input.toLowerCase() == defln.toLowerCase() || input.toLowerCase() == defp.toLowerCase() || input.toLowerCase() == defe.toLowerCase()){
   document.getElementById(id).value = ''; 
  }
}

function addUser(){

  if (document.getElementById("uploadBtn").innerHTML != 'click to upload a user image'){
    document.getElementById("photoButton").click();
  }

  var fname = document.getElementById("fname").value;
  var lname = document.getElementById("lname").value;
  var email = document.getElementById("email").value;
  var pwd = document.getElementById("pwd").value;
  var type = document.getElementById("dropdown-main").value;

  //Check for empty first name
  if (fname == null || fname == "" || fname == deffn) {
    document.getElementById("warning").innerHTML = "First Name must be filled out";
    document.getElementById("warningDiv").style.display = "block";
    return false;
  }
  //Check for empty last name
  if (lname == null || lname == "" || lname == defln) {
    document.getElementById("warning").innerHTML = "Last Name must be filled out";
    document.getElementById("warningDiv").style.display = "block";
    return false;
  }
  //Check for empty email
  if (email == null || email == "" || email == defe) {
    document.getElementById("warning").innerHTML = "Email must be filled out";
    document.getElementById("warningDiv").style.display = "block";
    return false;
  }
  //Check for empty password
  if (pwd == null || pwd == "" || pwd == defp) {
    document.getElementById("warning").innerHTML = "Password must be filled out";
    document.getElementById("warningDiv").style.display = "block";
    return false;
  }
    //Check for empty type
  if (type == null || type == "" || type == deft) {
    document.getElementById("warning").innerHTML = "User type must be filled out";
    document.getElementById("warningDiv").style.display = "block";
    return false;
  }
  if(type == 'Driver'){
    type = 0;
    if(document.getElementById("uploadBtn").innerHTML == 'click to upload a user image'){
      document.getElementById("warning").innerHTML = "User image must be chosen";
      document.getElementById("warningDiv").style.display = "block";
      return false;
    }
  } else{
    type = 1;
  }

  var exists = false;
  //Check to see if user exists
  $.ajax({
    url: 'http://' + ip + ':3000/get-users',
    type: 'GET',
    dataType: 'json',
    async: false,
    success: function(data) {
      for(var i in data){
        if(email.toLowerCase() == (data[i].email).toLowerCase()){
          exists = true;
        }        
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
        alert('Get User 1 error ' + textStatus + " " + errorThrown);    
        
    }
  });

  if (exists) {
    document.getElementById("warning").innerHTML = "Email already exists";
    document.getElementById("warningDiv").style.display = "block";
    return false;
  }



  //Add User to Database
  $.ajax({
    url: 'http://' + ip + ':3000/add-user', 
    type: 'GET',
    dataType: 'json',
    async: false,
    data: {
        'fname': fname,
        'lname': lname,
        'email' : email,
        'pwd' : pwd,
        'tp' : type,
        'photo' : photoName
    },
    success: function(data) {
      document.getElementById("success").innerHTML = fname + " added to Database";
      document.getElementById("successDiv").style.display = "block";
      document.getElementById("warningDiv").style.display = "none";

      getUsers();
      document.getElementById("fname").value = deffn;
      document.getElementById("lname").value = defln;
      document.getElementById("email").value = defe;
      document.getElementById("pwd").value = defp;
      document.getElementById("dropdown-main").value = deft;
      document.getElementById("pwd").type = 'text';
      document.getElementById("uploadBtn").innerHTML = 'click to upload a user image';
      return false;
    },
    error: function(jqXHR, textStatus, errorThrown) {
      alert('Add User error ' + textStatus + " " + errorThrown);
    }
  });  
}

function getUsers(){
    $.ajax({
    url: 'http://' + ip + ':3000/get-users',
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
        alert('Get User error ' + textStatus + " " + errorThrown);
    }
});
}

function deleteUser(email){

    $.ajax({
        url: 'http://' + ip + ':3000/delete-user?email=' + email,    // Pass route name here through a query
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
            alert('Delete User error ' + textStatus + " " + errorThrown);
        }
    });
};


$(document).ready(function() {
  $('#uploadForm').submit(function() {
    $(this).ajaxSubmit({
        async: false,
        error: function(xhr) {
          status('Photo Upload Error: ' + xhr.status);
        },
        success: function(response) {
          photoName = response;
        }
    });
    //Very important line, it disable the page refresh.
  return false;
  });    
});