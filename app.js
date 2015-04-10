var express = require('express');
var app = express();
var port    = parseInt(process.env.PORT, 10) || 3000;
var mysql      = require('mysql');
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

// Allows cross-domain calls
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(express.static(__dirname + "/public"));

//Add a route to the database
app.get('/add-route', function (req, res) {
  
  name = req.query.route;
  console.log("inside app.js: " + name);
  origin_lat = '';
  origin_long = '';
  dest_lat = '';
  dest_long = '';
  waypts = '';
  connection.query('SELECT rt.*, wp.order, wp.wp_long, wp.wp_lat FROM bsxpccom_cometradar.route_waypoints AS wp RIGHT JOIN bsxpccom_cometradar.routes AS rt ON rt.route_name = wp.route_name WHERE rt.route_name = "' + name + '";', function(err, rows, fields){
    if (err) throw err;
    res.send(rows);
  });

});

//Gets a route's waypoints
app.get('/route-waypoints', function (req, res) {
  route = req.query.route;

  connection.query('SELECT rt.*, wp.order, wp.wp_long, wp.wp_lat FROM bsxpccom_cometradar.route_waypoints AS wp RIGHT JOIN bsxpccom_cometradar.routes AS rt ON rt.route_name = wp.route_name WHERE rt.route_name = "' + route + '";', function(err, rows, fields){
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
  var date = req.query.date;
  if (route == "All"){
    connection.query('SELECT route_name, date, lat, bsxpccom_cometradar.routestops.long FROM bsxpccom_cometradar.routestops WHERE date >= "' + date + ' 00:00:00" AND date <= "' + date + ' 23:59:99";', function(err, rows, fields){
      if (err) throw err;
      for (var i in rows)
        rows[i].date = rows[i].date.toString().substr(16, 2);
      res.send(rows);
    });
  } else {
    connection.query('SELECT route_name, date, lat, bsxpccom_cometradar.routestops.long FROM bsxpccom_cometradar.routestops WHERE route_name = "' + route + '" AND date >= "' + date + ' 00:00:00" AND date <= "' + date + ' 23:59:99";', function(err, rows, fields){
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

app.listen(port);
console.log('App listening at %s', port);