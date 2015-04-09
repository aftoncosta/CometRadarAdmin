var overlay;
USGSOverlay.prototype = new google.maps.OverlayView();

var map;
var routeNames = [];
var cabStatus = [];
var cabLat = [];
var cabLong = [];
var cabNumbers = [];
var cabOccupancy = [];
var cabDriver = [];
var markers = [];


// Initialize the map and the custom overlay.
function initialize() {
  var mapOptions = {
    zoom: 16,
    center: new google.maps.LatLng(32.985700, -96.750114),
    mapTypeControl: false
  };

  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

  var swBound = new google.maps.LatLng(32.976600, -96.761700);
  var neBound = new google.maps.LatLng(32.995650, -96.739400);
  var bounds = new google.maps.LatLngBounds(swBound, neBound);
  var srcImage = '../img/map-overlay.gif';

  // The custom USGSOverlay object contains the USGS image,
  // the bounds of the image, and a reference to the map.
  overlay = new USGSOverlay(bounds, srcImage, map);
}


function setMarkers() {

  // Image for on-duty cart
  var image_green = {
    url: '../img/cart_green.png',
    size: new google.maps.Size(58, 58),
    origin: new google.maps.Point(0,0),
    anchor: new google.maps.Point(29, 58)
  };

  // Image for full cart
  var image_red = {
    url: '../img/cart_red.png',
    size: new google.maps.Size(58, 58),
    origin: new google.maps.Point(0,0),
    anchor: new google.maps.Point(29, 58)
  };

  // Image for off-duty cart
  var image_black = {
    url: '../img/cart.png',
    size: new google.maps.Size(58, 58),
    origin: new google.maps.Point(0,0),
    anchor: new google.maps.Point(29, 58)
  };

  // Add the markers to the map
  for (var item in routeNames){
    var isFull = false;
    var image;

    if (!cabStatus[item]){
      image = image_black;
      cabStatus[item] = 'off duty';
    } else {
      if (isFull) {
        image = image_red
        cabStatus[item] = 'full';
      } else {
        image = image_green
        cabStatus[item] = 'on duty';
      }
    }

    markers[item] = createMarkers(item, image);

  }
}

function createMarkers(id, image){
  var myLatLng = new google.maps.LatLng(cabLat[id], cabLong[id]);

  var marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        icon: image,
        title: routeNames[id],
        zIndex: 3
  });

  google.maps.event.addListener(marker, 'click', function() {
      var detailDiv = document.getElementById('cabDetails');
      var riderCountDiv = document.getElementById('riderCounts');


      parent.document.getElementById("cabDetails").innerHTML = "Status: " + cabStatus[id] + "<br/>"
                                                              + "Route: " + routeNames[id] + "<br/>"
                                                              + "Driver: " + cabDriver[id] + "<br/>"
                                                              + "Current Occupancy: " + cabOccupancy[id] + "<br/>";

      parent.document.getElementById("riderCounts").innerHTML = "Today: " + "<br/>"
                                                              + "Last Hour: " + "<br/>";

  });
  return marker;
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

$.ajax({
    url: 'http://127.0.0.1:3000/route-data',
    type: 'GET',
    dataType: 'json',
    timeout: 5000,
    success: function(data) {
        cabsInfo = data;
        for(var cab in data){
          routeNames[cab]   = data[cab].route_name;
          cabStatus[cab]    = data[cab].onduty;
          cabLat[cab]       = data[cab].currentLat;
          cabLong[cab]      = data[cab].currentLong;
          cabNumbers[cab]   = data[cab].shuttle;
          cabOccupancy[cab] = data[cab].students_on_shuttle;
          cabDriver[cab]    = data[cab].fname + ' ' + data[cab].lname; 
          setMarkers();
        }
    },
    error: function(jqXHR, textStatus, errorThrown) {
        alert('error ' + textStatus + " " + errorThrown);
    }
});

google.maps.event.addDomListener(window, 'load', initialize);