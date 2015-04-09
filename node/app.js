var express = require('express');
var app = express();
var port    = parseInt(process.env.PORT, 10) || 3000;
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
//var JSON = require('JSON'); 

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

app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  
  next();
});










app.post('/delete-route', function (req, res) {
    res.send("OK");
    console.log(req.body);
    var data = '';
    req.setEncoding('utf8');
    req.on('data', function(chunk) { 
        data += chunk;
    });
    req.on('end', function() {
        req.rawBody = data;
        console.log(req.rawBody);
        next();
    });
    console.log(data);
});


app.get('/route-names', function (req, res) {
  
  connection.query('SELECT route_name FROM bsxpccom_cometradar.routes;', function(err, rows, fields){
    if (err) throw err;
    res.send(rows);
  });
});


app.get('/route-data', function (req, res) {
  
  connection.query('SELECT route_name, shuttle, students_on_shuttle, currentLat, currentLong, fname, lname, onduty FROM (SELECT bsxpccom_cometradar.current_route.*, bsxpccom_cometradar.users.fname, bsxpccom_cometradar.users.lname FROM bsxpccom_cometradar.current_route INNER JOIN users ON bsxpccom_cometradar.current_route.email = bsxpccom_cometradar.users.email) a JOIN (SELECT bsxpccom_cometradar.routedata.onduty, bsxpccom_cometradar.routedata.email FROM bsxpccom_cometradar.routedata) b ON a.email = b.email;', 
    function(err, rows, fields){
      if (err) throw err;
      res.send(rows);
      console.log(rows);
    });
});

app.listen(port);
console.log('Example app listening at %s', port);