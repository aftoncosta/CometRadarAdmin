var rendererOptions = {
  draggable: true
};
var directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
var directionsService = new google.maps.DirectionsService();

var overlay;
USGSOverlay.prototype = new google.maps.OverlayView();
var utd = new google.maps.LatLng(32.985700, -96.750114)

// Initialize the map and the custom overlay.
function initialize() {
  var mapOptions = {
    zoom: 16,
    center: utd,
    mapTypeControl: false
  };

  var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

  var swBound = new google.maps.LatLng(32.976600, -96.761700);
  var neBound = new google.maps.LatLng(32.995650, -96.739400);
  var bounds = new google.maps.LatLngBounds(swBound, neBound);
  var srcImage = '../img/map-overlay.gif';

  // The custom USGSOverlay object contains the USGS image,
  // the bounds of the image, and a reference to the map.
  overlay = new USGSOverlay(bounds, srcImage, map);

  directionsDisplay.setMap(map);
  directionsDisplay.setPanel(document.getElementById('directionsPanel'));

  google.maps.event.addListener(directionsDisplay, 'directions_changed', function() {
    computeTotalDistance(directionsDisplay.getDirections());

    var originLat = directionsDisplay.getDirections().tc.origin.k;
    var originLong = directionsDisplay.getDirections().tc.origin.D;
    var destLat = directionsDisplay.getDirections().tc.destination.k;
    var destLong = directionsDisplay.getDirections().tc.destination.D;
    var waypointsLat = [];
    var waypointsLong = [];
    var wayArray = directionsDisplay.getDirections().tc.waypoints;
    for ( var i in wayArray){
      waypointsLat[i] = wayArray[i].location.k;
      waypointsLong[i] = wayArray[i].location.D;
    }
    console.log(waypointsLat);
  });

  calcRoute();
}

function displayWaypoints(result) {  
    for (var i = 0; i < markers.length; ++i) {  
        markers[i].setMap(null);  
    }  
    markers = [];  
    if (result.sf.waypoints) {  
            for (var i = 0; i < result.sf.waypoints.length; ++i) {  
                    var latitude = result.sf.waypoints[i].location.wa;  
                    var longitude = result.sf.waypoints[i].location.ya;    
                    markers.push(new google.maps.Marker({  
                            position: new google.maps.LatLng(latitude, longitude),  
                            map: map  
                    }));  
            }  
    }  
}  


function USGSOverlay(bounds, image, map) {

  // Initialize all properties.
  this.bounds_ = bounds;
  this.image_ = image;
  this.map_ = map;

  // Define a property to hold the image's div. We'll
  // actually create this div upon receipt of the onAdd()
  // method so we'll leave it null for now.
  this.div_ = null;

  // Explicitly call setMap on this overlay.
  this.setMap(map);
}


// onAdd is called when the map's panes are ready and the overlay has been
// added to the map.
USGSOverlay.prototype.onAdd = function() {

  var div = document.createElement('div');
  div.style.borderStyle = 'none';
  div.style.borderWidth = '0px';
  div.style.position = 'absolute';

  // Create the img element and attach it to the div.
  var img = document.createElement('img');
  img.src = this.image_;
  img.style.width = '100%';
  img.style.height = '100%';
  img.style.position = 'absolute';
  div.appendChild(img);

  this.div_ = div;

  // Add the element to the "overlayLayer" pane.
  var panes = this.getPanes();
  panes.overlayLayer.appendChild(div);
};

USGSOverlay.prototype.draw = function() {

  // We use the south-west and north-east
  // coordinates of the overlay to peg it to the correct position and size.
  // To do this, we need to retrieve the projection from the overlay.
  var overlayProjection = this.getProjection();

  // Retrieve the south-west and north-east coordinates of this overlay
  // in LatLngs and convert them to pixel coordinates.
  // We'll use these coordinates to resize the div.
  var sw = overlayProjection.fromLatLngToDivPixel(this.bounds_.getSouthWest());
  var ne = overlayProjection.fromLatLngToDivPixel(this.bounds_.getNorthEast());

  // Resize the image's div to fit the indicated dimensions.
  var div = this.div_;
  div.style.left = sw.x + 'px';
  div.style.top = ne.y + 'px';
  div.style.width = (ne.x - sw.x) + 'px';
  div.style.height = (sw.y - ne.y) + 'px';
};

// The onRemove() method will be called automatically from the API if
// we ever set the overlay's map property to 'null'.
USGSOverlay.prototype.onRemove = function() {
  this.div_.parentNode.removeChild(this.div_);
  this.div_ = null;
};

function calcRoute() {

  var request = {
    origin: new google.maps.LatLng(32.989500, -96.751014),
    destination: new google.maps.LatLng(32.986000, -96.751014),
    travelMode: google.maps.TravelMode.DRIVING
  };
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
    }
  });
  
}

function computeTotalDistance(result) {
  var total = 0;
  var myroute = result.routes[0];

  for (var i = 0; i < myroute.legs.length; i++) {
    total += myroute.legs[i].distance.value;
  }
  total = total / 1000.0;
}


google.maps.event.addDomListener(window, 'load', initialize);

function inputClick(){
  var name = document.getElementById("name").value;
  var def = 'Route name';
  if(name.toLowerCase() == def.toLowerCase()){
   document.getElementById("name").value = ''; 
  }
}

function addRoute(){
  var name = document.getElementById("name").value;
  console.log(name);
 
  //Check for empty name
  if (name == null || name == "" || name == 'Route name') {
    alert("Route Name must be filled out");
    return false;
  }
  var exists = false;
  //Check to see if name already exists
  $.ajax({
    url: 'http://127.0.0.1:3000/route-names',
    type: 'GET',
    dataType: 'json',
    async: false,
    timeout: 5000,
    success: function(data) {
        
        for(var i in data){
            if(name.toLowerCase() == (data[i].route_name).toLowerCase()){
              exists = true;
            }        
        }
    },
    error: function(jqXHR, textStatus, errorThrown) {
        alert('error ' + textStatus + " " + errorThrown);    
        if (exists) {
          alert("Name already exists");
          return false;
        }
    }
  });

  if (exists) {
    alert("Name already exists");
    return false;
  }
  //console.log(directionsService.origin);
/*
    var waypts = [];
      for(var i in data){
            waypts.push({
                location:new google.maps.LatLng(data[i].wp_lat, data[i].wp_long)
            });
      }
      calcRoute(data[0].originLat, data[0].originLong, data[0].destLat, data[0].destLong, waypts);
      */
 // console.log("Origin: " + JSON.stringify(directionsDisplay.directions.tc.origin));
  //console.log("Destination: " + JSON.stringify(directionsDisplay.directions.tc.destination));
  //console.log("Waypoints: " + JSON.stringify(directionsDisplay.directions.tc.waypoints));

  //k = latitide
  //D = longitude
  origin_lat = directionsDisplay.directions.tc.origin.k;
  origin_long = directionsDisplay.directions.tc.origin.D;
  dest_lat = directionsDisplay.directions.tc.destination.k;
  dest_long = directionsDisplay.directions.tc.destination.D;
  //directionsDisplay.directions.tc.waypoints[i].location.k
  waypts = directionsDisplay.directions.tc.waypoints;
  //console.log(origin_lat + origin_long + dest_lat + dest_long + waypts);
  console.log(origin_lat.toString());


  //console.log(directionsDisplay.directions.route[0].legs[0].via_waypoint);
  //Add Route to Database
  $.ajax({
    url: 'http://127.0.0.1:3000/add-route', 
    type: 'GET',
    dataType: 'json',
    data: {
        'route': name,
        'origin_lat': origin_lat,
        'origin_long' : origin_long,
        'dest_lat' : dest_lat,
        'dest_long' : dest_long,
        'waypts' : waypts
    },
    timeout: 5000,
    success: function(data) {
      alert(name + " Route added to Database");
      return false;
    },
    error: function(jqXHR, textStatus, errorThrown) {
            alert('error ' + textStatus + " " + errorThrown);
      }
   });
  
}
