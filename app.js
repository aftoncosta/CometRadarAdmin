var express = require('express');
var app = express();
var port    = parseInt(process.env.PORT, 10) || 3000;
var mysql      = require('mysql');
var passport = require('passport');
var util = require('util');
var LocalStrategy = require('passport-local').Strategy;
  
var users = [
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

// Configuring Passport
var expressSession = require('express-session');
//app.use(expressSession({secret: 'mySecretKey'}));
app.use(passport.initialize());
app.use(passport.session());

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

// Allows cross-domain calls
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(express.static(__dirname + "/public"));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// RIDER APP app
app.get('/doQuery', function(req, res){
    var query = req.query.string; // store the part of the URL that comes after ?string= ... we send this in the android app
    connection.query(query, function(err, rows, fields){  // calls the query
    
    if (err) throw err;
    	res.send(rows);   // sends the response data (in JSON format) back to android. You can also check the response at localhost:3001/sendPickup?string=YOUR QUERY HERE
                        // for INSERT commands, it just returns the number of rows changed and some other useless crap
                        // but for SELECT commands, it'll return the DB rows in JSON format. Look at localhost:3000/route-names as an example
    });
});
//app.listen(3001)


//Add a route to the database
app.get('/add-route', function (req, res) {
  name = req.query.route;
  origin_lat = req.query.origin_lat;
  origin_long = req.query.origin_long;
  dest_lat = req.query.dest_lat;
  dest_long = req.query.dest_long;
  wayptsLat = req.query.wayptsLat;
  wayptsLong = req.query.wayptsLong;

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
  });
});

//Gets a route's waypoints
app.get('/route-waypoints', function (req, res) {
  route = req.query.route;

  connection.query('SELECT rt.*, wp.order, wp.wp_long, wp.wp_lat FROM bsxpccom_cometradar.route_waypoints AS wp RIGHT JOIN bsxpccom_cometradar.routes AS rt ON rt.route_name = wp.route_name WHERE rt.route_name = "' + route + '" ORDER BY wp.order;', function(err, rows, fields){
    if (err) throw err;
    res.send(rows);
  });
});

// Deletes a route
app.get('/delete-route', function (req, res) {
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

});

// Get route names
app.get('/route-names', function (req, res) {
  
  connection.query('SELECT route_name FROM bsxpccom_cometradar.routes;', function(err, rows, fields){
    if (err) throw err;
    res.send(rows);
  });

});

// Get route names
app.get('/stops', function (req, res) {

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
});

// Get route data (route name, shuttle#, occupancy, location coords, driver name, on/off duty)
app.get('/route-data', function (req, res) {
  connection.query('SELECT route_name, shuttle, students_on_shuttle, currentLat, currentLong, fname, lname, shiftstart_date, shiftend_date, onduty FROM (SELECT bsxpccom_cometradar.current_route.*, bsxpccom_cometradar.users.fname, bsxpccom_cometradar.users.lname FROM bsxpccom_cometradar.current_route INNER JOIN users ON bsxpccom_cometradar.current_route.email = bsxpccom_cometradar.users.email) a JOIN (SELECT bsxpccom_cometradar.routedata.shiftend_date, bsxpccom_cometradar.routedata.shiftstart_date, bsxpccom_cometradar.routedata.onduty, bsxpccom_cometradar.routedata.email FROM bsxpccom_cometradar.routedata) b ON a.email = b.email;', 
    function(err, rows, fields){
      if (err) throw err;
      res.send(rows);
    });
});

//DRIVER APP
//TODO move behind login wall
app.get('/api/getRiderLocations', function (req, res) {
  //TODO add date to query
  connection.query('SELECT pr.lat, pr.long FROM `pickup_request` AS pr WHERE ROUTE_NAME=\'' + req.query.rname + '\'', function (error, results, fields) {
    console.log('Error: ' + error);
    res.send(results);
  }); 
});

//TODO move behind login wall
app.get('/api/getRoute', function (req, res) {
  connection.query('SELECT r.order, r.wp_lat AS lat, r.wp_long AS \'long\' FROM `route_waypoints` as r WHERE ROUTE_NAME=\'' + req.query.rname + '\' ORDER BY r.order ASC', function (error, results, fields) {
    console.log('Error: ' + error);
    res.send(results);
  }); 
});

//TODO move behind login wall
app.get('/api/updateLocation', function (req, res) {
  connection.query('UPDATE `current_route` SET currentLat=\'' + req.query.lat + '\',currentLong=\'' + req.query.long 
    + '\' WHERE route_name=\'' + req.query.rname + '\'', function (error, results, fields) {
    console.log('Error: ' + error);
    res.send(results);
  }); 
});

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
