var express = require('express');
var app = express();
var server = express();
var port    = parseInt(process.env.PORT, 10) || 3000;
var mysql      = require('mysql');


app.use(express.static(__dirname + "/public"));




// RIDER APP SERVER
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
      res.send(rows);   // sends the response data (in JSON format) back to android. You can also check the response at localhost:3001/sendPickup?string=YOUR QUERY HERE
                        // for INSERT commands, it just returns the number of rows changed and some other useless crap
                        // but for SELECT commands, it'll return the DB rows in JSON format. Look at localhost:3000/route-names as an example
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
  
  connection.end();
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

  connection.query('SELECT route_name, a.shuttle, students_on_shuttle, max, shiftstart_date, shiftend_date, currentLat, currentLong, fname, lname, onduty FROM (SELECT bsxpccom_cometradar.current_route.*, bsxpccom_cometradar.users.fname, bsxpccom_cometradar.users.lname FROM bsxpccom_cometradar.current_route INNER JOIN users ON bsxpccom_cometradar.current_route.email = bsxpccom_cometradar.users.email) a JOIN (SELECT bsxpccom_cometradar.routedata.onduty, bsxpccom_cometradar.routedata.email, bsxpccom_cometradar.routedata.shiftstart_date, bsxpccom_cometradar.routedata.shiftend_date, bsxpccom_cometradar.shuttle.max, bsxpccom_cometradar.shuttle.shuttle FROM bsxpccom_cometradar.routedata INNER JOIN shuttle ON bsxpccom_cometradar.routedata.shuttle = bsxpccom_cometradar.shuttle.shuttle) b ON a.email = b.email AND a.shuttle = b.shuttle;',
    function(err, rows, fields){
      if (err) throw err;
      res.send(rows);
    });
  connection.end();
});

app.listen(port);
console.log('App listening at %s', port);
