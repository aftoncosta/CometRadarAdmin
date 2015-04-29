var express       = require('express');
var app           = express();
var port          = parseInt(process.env.PORT, 10) || 3000;
var mysql         = require('mysql');
var passport      = require('passport');
var util          = require('util');
var multer        = require('multer');
var LocalStrategy = require('passport-local').Strategy;
var expressSession = require('express-session');
var phantom = require('phantom');

var users         = [
    { id: 1, username: 'bob', password: 'secret', email: 'bob@example.com' }
  , { id: 2, username: 'joe', password: 'birthday', email: 'joe@example.com' }
];

function findById(id, fn) {
  var idx = id - 1;
  if (users[idx]) {
    fn(null, users[idx]);
  } else {
    fn(new Error('User ' + id + ' does not exist'));
  }
}

function findByUsername(username, fn) {
  for (var i = 0, len = users.length; i < len; i++) {
    var user = users[i];
    if (user.username === username) {
      return fn(null, user);
    }
  }
  return fn(null, null);
}

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.
passport.serializeUser(function(user, done) {
  done(null, user._id);
});
 
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});


// Use the LocalStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a username and password), and invoke a callback
//   with a user object.  In the real world, this would query a database;
//   however, in this example we are using a baked-in set of users.
passport.use(new LocalStrategy(
  function(username, password, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      
      // Find the user by username.  If there is no user with the given
      // username, or the password is not correct, set the user to `false` to
      // indicate failure and set a flash message.  Otherwise, return the
      // authenticated `user`.
      findByUsername(username, function(err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
        if (user.password != password) { return done(null, false, { message: 'Invalid password' }); }
        return done(null, user);
      })
    });
  }
));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});



// Configuring Passport
//app.use(expressSession({secret: 'mySecretKey'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + "/public"));

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});


// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/');
}





// RIDER APP app
app.get('/doQuery', function(req, res){
    var connection = mysql.createConnection({
      host     : '69.195.124.139',
      user     : 'bsxpccom_teamX',
      password : 'C$1RFKqdCr&w',
      database : 'bsxpccom_cometradar'
    });

    connection.connect(function(err){
      if (err){
          console.log('DB Connection error');
      }
    });

    var query = req.query.string; // store the part of the URL that comes after ?string= ... we send this in the android app
    connection.query(query, function(err, rows, fields){  // calls the query
    
    if (err) throw err;
      console.log(rows);
    	res.send(rows);   // sends the response data (in JSON format) back to android. You can also check the response at localhost:3001/sendPickup?string=YOUR QUERY HERE
                        // for INSERT commands, it just returns the number of rows changed and some other useless crap
                        // but for SELECT commands, it'll return the DB rows in JSON format. Look at localhost:3000/route-names as an example
    });
    connection.end();
});

app.get('/pickup', function(req, res){
  var route = req.query.route; 
  var lat = req.query.lat; 
  var lon = req.query.lon; 

  phantom.create(function (ph) {
    ph.createPage(function (page) {
      page.open("http://104.197.3.201:3000/pickupLocEJS?route=" + route + "&lat=" + lat + "&lon=" + lon, function (status) {
        setTimeout(function screenshot() {
          console.log("opened pickupLoc? ", status);
          page.evaluate(function () { return document.getElementById('statusDiv').innerHTML; }, function (result) {
            console.log('Location is ' + result);
            res.send(result);
            ph.exit();
          });
        }, 3 * 1000);        
      });
    });
  });
});


app.get('/pickupLocEJS', function(req, res){
  var route = req.query.route; 
  var lat = req.query.lat; 
  var lon = req.query.lon; 

  res.render("pickupLoc.ejs", { route: route, lat: lat, lon: lon });
  console.log("here");
});

// Upload user photos to /public/uploads
app.use(multer({ dest: './public/uploads/',
 rename: function (fieldname, filename) {
    return filename+Date.now();
  },
onFileUploadStart: function (file) {
  console.log(file.originalname + ' is starting ...')
},
onFileUploadComplete: function (file) {
  console.log(file.fieldname + ' uploaded to  ' + file.path)
  done=true;
}
}));


app.post('/api/photo',function(req,res){
  if(done==true){
    console.log(req.files.userPhoto.name);
    res.end(req.files.userPhoto.name);
  }
});


//Add a user to the database
app.get('/add-user', function (req, res) {
  var connection = mysql.createConnection({
    host     : '69.195.124.139',
    user     : 'bsxpccom_teamX',
    password : 'C$1RFKqdCr&w',
    database : 'bsxpccom_cometradar'
  });

  connection.connect(function(err){
    if (err){
        console.log('DB Connection error');
    }
  });
  
  email = req.query.email;
  fname = req.query.fname;
  lname = req.query.lname;
  type = req.query.tp;
  pwd = req.query.pwd;
  picture = req.query.photo;

  connection.query('INSERT INTO bsxpccom_cometradar.users VALUES ("' + email + '","' + pwd + '","' + fname + '","' + lname + '","' + type + '","' + picture + '");', function(err, rows, fields){
    if (err) throw err;
    res.send(rows);
  });
  
  connection.end();
});

// Deletes a user
app.get('/delete-user', function (req, res) {
  var connection = mysql.createConnection({
    host     : '69.195.124.139',
    user     : 'bsxpccom_teamX',
    password : 'C$1RFKqdCr&w',
    database : 'bsxpccom_cometradar'
  });

  connection.connect(function(err){
    if (err){
        console.log('DB Connection error');
    }
  });
  email = req.query.email;

  // Delete the user from ROUTEDATA
  connection.query('DELETE FROM bsxpccom_cometradar.routedata WHERE bsxpccom_cometradar.routedata.email = "' + email + '";', function(err, rows, fields){
    if (err) throw err;
  });

  // Delete the user from CURRENT_ROUTE
  connection.query('DELETE FROM bsxpccom_cometradar.current_route WHERE bsxpccom_cometradar.current_route.email = "' + email + '";', function(err, rows, fields){
    if (err) throw err;
  });

  // Delete the user from USERS
  connection.query('DELETE FROM bsxpccom_cometradar.users WHERE bsxpccom_cometradar.users.email = "' + email + '";', function(err, rows, fields){
    if (err) throw err;
  });

  // return new set of users
  connection.query('SELECT * FROM bsxpccom_cometradar.users;', function(err, rows, fields){
    if (err) throw err;
    res.send(rows);
  });
  connection.end();
});

// Get user
app.get('/get-users', function (req, res) {
  var connection = mysql.createConnection({
    host     : '69.195.124.139',
    user     : 'bsxpccom_teamX',
    password : 'C$1RFKqdCr&w',
    database : 'bsxpccom_cometradar'
  });

  connection.connect(function(err){
    if (err){
        console.log('DB Connection error');
    }
  });
  
  connection.query('SELECT * FROM bsxpccom_cometradar.users;', function(err, rows, fields){
    if (err) throw err;
    res.send(rows);
  });
  connection.end();
});

//Add a route to the database
app.get('/add-route', function (req, res) {
  var connection = mysql.createConnection({
    host     : '69.195.124.139',
    user     : 'bsxpccom_teamX',
    password : 'C$1RFKqdCr&w',
    database : 'bsxpccom_cometradar'
  });

  connection.connect(function(err){
    if (err){
        console.log('DB Connection error');
    }
  });
  
  name = req.query.route;
  origin_lat = req.query.origin_lat;
  origin_long = req.query.origin_long;
  dest_lat = req.query.dest_lat;
  dest_long = req.query.dest_long;
  wayptsLat = req.query.wayptsLat;
  wayptsLong = req.query.wayptsLong;

  //console.log('app.js ' + wayptsLat);

  connection.query('INSERT INTO bsxpccom_cometradar.routes VALUES ("' + name + '","' + origin_lat + '","' + origin_long + '","' + dest_lat + '","' + dest_long + '");', function(err, rows, fields){
    if (err) throw err;

    if(wayptsLat != null){
      for(var i in wayptsLat){
        connection.query('INSERT INTO bsxpccom_cometradar.route_waypoints VALUES ("' + name + '","' + i + '","' + wayptsLat[i] + '","' + wayptsLong[i] + '");', function(err, rows, fields){
        if (err) throw err;
        });
      }
    }
    res.send(rows);
    connection.end();
  });
  
  //connection.end();
});

//Gets a route's waypoints
app.get('/route-waypoints', function (req, res) {
  var connection = mysql.createConnection({
    host     : '69.195.124.139',
    user     : 'bsxpccom_teamX',
    password : 'C$1RFKqdCr&w',
    database : 'bsxpccom_cometradar'
  });

  connection.connect(function(err){
    if (err){
        console.log('DB Connection error');
    }
  });

  route = req.query.route;

  connection.query('SELECT rt.*, wp.order, wp.wp_long, wp.wp_lat FROM bsxpccom_cometradar.route_waypoints AS wp RIGHT JOIN bsxpccom_cometradar.routes AS rt ON rt.route_name = wp.route_name WHERE rt.route_name = "' + route + '" ORDER BY wp.order;', function(err, rows, fields){
    if (err) throw err;
    res.send(rows);
  });

  connection.end();
});

// Deletes a route
app.get('/delete-route', function (req, res) {
  var connection = mysql.createConnection({
    host     : '69.195.124.139',
    user     : 'bsxpccom_teamX',
    password : 'C$1RFKqdCr&w',
    database : 'bsxpccom_cometradar'
  });

  connection.connect(function(err){
    if (err){
        console.log('DB Connection error');
    }
  });
  route = req.query.route;

  // Delete the route from ROUTEDATA
  connection.query('DELETE FROM bsxpccom_cometradar.routedata WHERE bsxpccom_cometradar.routedata.route_name = "' + route + '";', function(err, rows, fields){
    if (err) throw err;
  });

  // Delete the route from ROUTE_WAYPOINTS
  connection.query('DELETE FROM bsxpccom_cometradar.route_waypoints WHERE bsxpccom_cometradar.route_waypoints.route_name = "' + route + '";', function(err, rows, fields){
    if (err) throw err;
  });

  // Delete the route from ROUTE table
  connection.query('DELETE FROM bsxpccom_cometradar.routes WHERE bsxpccom_cometradar.routes.route_name = "' + route + '";', function(err, rows, fields){
    if (err) throw err;
  });

  // return new set of routes
  connection.query('SELECT route_name FROM bsxpccom_cometradar.routes;', function(err, rows, fields){
    if (err) throw err;
    res.send(rows);
  });
  connection.end();
});

// Get route names
app.get('/route-names', function (req, res) {
  var connection = mysql.createConnection({
    host     : '69.195.124.139',
    user     : 'bsxpccom_teamX',
    password : 'C$1RFKqdCr&w',
    database : 'bsxpccom_cometradar'
  });

  connection.connect(function(err){
    if (err){
        console.log('DB Connection error');
    }
  });
  
  connection.query('SELECT route_name FROM bsxpccom_cometradar.routes;', function(err, rows, fields){
    if (err) throw err;
    res.send(rows);
  });
  connection.end();
});

// Get route names
app.get('/stops', function (req, res) {
  var connection = mysql.createConnection({
    host     : '69.195.124.139',
    user     : 'bsxpccom_teamX',
    password : 'C$1RFKqdCr&w',
    database : 'bsxpccom_cometradar'
  });

  connection.connect(function(err){
    if (err){
        console.log('DB Connection error');
    }
  });

  var route = req.query.route;
  var startDate = req.query.startDate;
  var endDate = req.query.endDate;

  if (route == "All"){
    connection.query('SELECT route_name, date, lat, bsxpccom_cometradar.routestops.long FROM bsxpccom_cometradar.routestops WHERE date >= "' + startDate + ' 00:00:00" AND date <= "' + endDate + ' 23:59:99";', function(err, rows, fields){    
      if (err) throw err;
      for (var i in rows)
        rows[i].date = rows[i].date.toString().substr(16, 2);
      res.send(rows);
    });
  } else {
    connection.query('SELECT route_name, date, lat, bsxpccom_cometradar.routestops.long FROM bsxpccom_cometradar.routestops WHERE route_name = "' + route + '" AND date >= "' + startDate + ' 00:00:00" AND date <= "' + endDate + ' 23:59:99";', function(err, rows, fields){
      if (err) throw err;
      for (var i in rows)
        rows[i].date = rows[i].date.toString().substr(16, 2);
      res.send(rows);
    });
  }
  connection.end();
});

// Get route data (route name, shuttle#, current occupancy,, max occupancy, location coords, driver name, on/off duty)
app.get('/route-data', function (req, res) {
  var connection = mysql.createConnection({
    host     : '69.195.124.139',
    user     : 'bsxpccom_teamX',
    password : 'C$1RFKqdCr&w',
    database : 'bsxpccom_cometradar'
  });

  connection.connect(function(err){
    if (err){
        console.log('DB Connection error');
    }
  });

  connection.query('SELECT route_name, a.shuttle, students_on_shuttle, max, shiftstart_date, shiftend_date, currentLat, currentLong, fname, lname,  picture, onduty FROM (SELECT bsxpccom_cometradar.current_route.*, bsxpccom_cometradar.users.fname, bsxpccom_cometradar.users.lname, bsxpccom_cometradar.users.picture FROM bsxpccom_cometradar.current_route INNER JOIN users ON bsxpccom_cometradar.current_route.email = bsxpccom_cometradar.users.email) a JOIN (SELECT bsxpccom_cometradar.routedata.onduty, bsxpccom_cometradar.routedata.email, bsxpccom_cometradar.routedata.shiftstart_date, bsxpccom_cometradar.routedata.shiftend_date, bsxpccom_cometradar.shuttle.max, bsxpccom_cometradar.shuttle.shuttle FROM bsxpccom_cometradar.routedata INNER JOIN shuttle ON bsxpccom_cometradar.routedata.shuttle = bsxpccom_cometradar.shuttle.shuttle) b ON a.email = b.email AND a.shuttle = b.shuttle;',
    function(err, rows, fields){
      if (err) throw err;
      res.send(rows);
    });
  connection.end();
});

//DRIVER APP
//TODO move behind login wall
app.get('/api/getRiderLocations', function (req, res) {
  var connection = mysql.createConnection({
    host     : '69.195.124.139',
    user     : 'bsxpccom_teamX',
    password : 'C$1RFKqdCr&w',
    database : 'bsxpccom_cometradar'
  });

  connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
    console.log('connected as id ' + connection.threadId);
  });

  //TODO add date to query
  connection.query('SELECT pr.lat, pr.long FROM `pickup_request` AS pr WHERE ROUTE_NAME=\'' + req.query.rname + '\'', function (error, results, fields) {
    console.log('Error: ' + error);
    res.send(results);
  }); 
  connection.end();
});

app.get('/api/updateLocation', function (req, res) {
  var connection = mysql.createConnection({
    host     : '69.195.124.139',
    user     : 'bsxpccom_teamX',
    password : 'C$1RFKqdCr&w',
    database : 'bsxpccom_cometradar'
  });

  connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
    console.log('connected as id ' + connection.threadId);
  });

  connection.query('UPDATE `current_route` SET currentLat=\'' + req.query.lat + '\',currentLong=\'' + req.query.long 
    + '\' WHERE route_name=\'' + req.query.rname + '\'', function (error, results, fields) {
    console.log('Error: ' + error);
    res.send(results);
  });
  connection.end(); 
});

//TODO update with default route coordinates
app.get('/api/createCurrentRoute', function (req, res) {
  var connection = mysql.createConnection({
    host     : '69.195.124.139',
    user     : 'bsxpccom_teamX',
    password : 'C$1RFKqdCr&w',
    database : 'bsxpccom_cometradar'
  });

  connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
    console.log('connected as id ' + connection.threadId);
  });

  connection.query('SELECT * FROM bsxpccom_cometradar.users WHERE email=\'' + req.query.email + '\' AND password=\'' 
  	+ req.query.password + '\';', function(err, rows, fields){
    if (err) throw err;
    if(!rows){
		console.log('Error: ' + error);
  		connection.end(); 	
    }
    console.log(rows);

  	connection.query('INSERT INTO `current_route` SET route_name=\'' + req.query.rname + '\',email=\'' + req.query.email 
  		+ '\',shuttle=' + req.query.shuttle + ',students_on_shuttle=0,currentLat=32.985700,currentLong=-96.752514', 
  		function (error, results, fields) {
  			if(error){
		    	console.log('Error: ' + error);
		    	res.send('failure');
		    }
		    res.send('success');
  			connection.end(); 
  	});

    connection.query('INSERT INTO `route` SET route_name=\'' + req.query.rname + '\',email=\'' + req.query.email 
      + '\',shuttle=' + req.query.shuttle + ',onduty=1, shiftstart_date=NOW(), shiftend_date=DATE_ADD(NOW(), INTERVAL 2 HOUR)', 
      function (error, results, fields) {
        if(error){
          console.log('Error: ' + error);
          res.send('failure');
        }
        res.send('success');
        connection.end(); 
    });
  });

});

//updates stop locations on a given route
//requires rname, lat, long, isPickup
app.get('/api/updateRouteStops', function(req, res){
  var connection = mysql.createConnection({
    host     : '69.195.124.139',
    user     : 'bsxpccom_teamX',
    password : 'C$1RFKqdCr&w',
    database : 'bsxpccom_cometradar'
  });

  connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
    console.log('connected as id ' + connection.threadId);
  });

  console.log("req.query.lat: " + req.query.lat);
  console.log("req.query.long: " + req.query.long);

  connection.query('INSERT INTO `routestops` AS rs (rs.route_name,rs.email,rs.date,rs.lat,rs.long,rs.isPickup) VALUES (\'' 
  	+ req.query.rname + '\',\'' + req.query.email + '\',\'' + (new Date().toISOString().slice(0, 19).replace('T', ' ')) + '\',' + req.query.lat 
  	+ ',' + req.query.long + ',' + req.query.isPickup, 
    function (error, results, fields) {
    	console.log('Error: ' + error);
    	res.send(results);
  	}
  );

  connection.end(); 	
})

//TODO test updateridercount
app.get('/api/updateRiderCount', function(req, res){
  var connection = mysql.createConnection({
    host     : '69.195.124.139',
    user     : 'bsxpccom_teamX',
    password : 'C$1RFKqdCr&w',
    database : 'bsxpccom_cometradar'
  });

  connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
    console.log('connected as id ' + connection.threadId);
  });

  connection.query('UPDATE `current_route` SET students_on_shuttle=' + req.query.currentCapacity 
  	+ ' WHERE route_name=\'' + req.query.rname + '\'AND email=\'' + req.query.email + '\'', 
    function (error, results, fields) {
    	console.log('Error: ' + error);
    	res.send(results);
  	}
  );
  connection.end(); 	
})

//TODO implement duty status ??
//TODO add date to query
app.get('/api/getDutyStatus', function(req, res){
  var connection = mysql.createConnection({
    host     : '69.195.124.139',
    user     : 'bsxpccom_teamX',
    password : 'C$1RFKqdCr&w',
    database : 'bsxpccom_cometradar'
  });

  connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
    console.log('connected as id ' + connection.threadId);
  });

  connection.query('SELECT onduty FROM `routedata` WHERE route_name=\'' + req.query.rname + '\' AND email=\'' 
    + req.query.email + '\' AND NOW() BETWEEN shiftstart_date AND shiftend_date', 
    function (error, results, fields) {
    	console.log('Error: ' + error);
    	res.send(results);
  	}
  );
  connection.end(); 	
})

//TODO add date to query (WHERE NOW() BETWEEN date_from AND date_to)
app.get('/api/updateDutyStatus', function(req, res){
  var connection = mysql.createConnection({
    host     : '69.195.124.139',
    user     : 'bsxpccom_teamX',
    password : 'C$1RFKqdCr&w',
    database : 'bsxpccom_cometradar'
  });

  connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
    console.log('connected as id ' + connection.threadId);
  });

  connection.query('UPDATE `routedata` SET onduty=' + req.query.dutyStatus +' WHERE route_name=\'' + req.query.rname 
  	+ '\' AND email=\'' + req.query.email + '\' AND NOW() BETWEEN shiftstart_date AND shiftend_date', 
    function (error, results, fields) {
    	console.log('Error: ' + error);
    	res.send(results);
  	}
  );
  connection.end(); 	
})

//get the current shuttle's max capacity
app.get('/api/getShuttleCapacity', function(req, res){
  var connection = mysql.createConnection({
    host     : '69.195.124.139',
    user     : 'bsxpccom_teamX',
    password : 'C$1RFKqdCr&w',
    database : 'bsxpccom_cometradar'
  });

  connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
    console.log('GetShuttleCapacity: connected as id ' + connection.threadId);
  });

//  connection.query('SELECT * FROM `shuttle` WHERE shuttle = ' + req.query.shuttle,
  connection.query('SELECT * FROM `shuttle` WHERE shuttle = (SELECT shuttle FROM `current_route` WHERE route_name = \'' 
    + req.query.rname +'\' AND email = \'' + req.query.email + '\'',
    function (error, results, fields) {
    	console.log('Error: ' + error);
    	console.log('Results: ' + results);
    	res.send(results);
  	}
  );
  connection.end(); 	
})

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/index.html', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

app.get(/\/(css|fonts|img|js|maps)\/.*/, function(req, res){
  res.sendFile(__dirname + '/public' + req.originalUrl);
});

//require authentication for all files below this

app.use(function(req, res, next){
  return ensureAuthenticated(req, res, next);
});

app.use(express.static(__dirname + '/public'));



app.listen(port);
console.log('App listening at %s', port);
