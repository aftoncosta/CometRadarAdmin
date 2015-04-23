var overlay;
USGSOverlay.prototype = new google.maps.OverlayView();


var ip = '104.197.3.201';
var map;
var routeNames = [];
var cabStatusBool = [];
var cabMax = [];
var cabStatusString = [];
var cabLat = [];
var cabLong = [];
var cabNumbers = [];
var cabOccupancy = [];
var cabDriver = [];
var driverPhoto = [];
var shiftStart = [];
var shiftEnd = [];
var cabFull = [];
var markers = [];
var images = [];


// Initialize the map and the custom overlay.
function initialize() {
  var mapOptions = {
    zoom: 16,
    center: new google.maps.LatLng(32.985700, -96.750114),
    mapTypeControl: false
  };

  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

  var swBound = new google.maps.LatLng(32.976600, -96.772500);
  var neBound = new google.maps.LatLng(32.995650, -96.750600);
  var bounds = new google.maps.LatLngBounds(swBound, neBound);
  var srcImage = '../img/map-overlay.gif';

  // The custom USGSOverlay object contains the USGS image,
  // the bounds of the image, and a reference to the map.
  overlay = new USGSOverlay(bounds, srcImage, map);
}


function setMarkers() {

  for (var i in markers) {
    markers[i].setMap(null);
  }
  markers.length = 0;

  images = [];
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
    var isFull = cabFull[item];
    //var image;

    if (!cabStatusBool[item]){
      images[item] = image_black;
      cabStatusString[item] = 'off duty';
    } else {
      if (isFull) {
        images[item] = image_red
        cabStatusString[item] = 'full';
      } else {
        images[item] = image_green
        cabStatusString[item] = 'on duty';
      }
    }

    markers[item] = createMarkers(item);

  }
}

function createMarkers(id){
  var myLatLng = new google.maps.LatLng(cabLat[id], cabLong[id]);

  var marker = new google.maps.Marker({
    position: myLatLng,
    map: map,
    icon: images[id],
    title: routeNames[id],
    zIndex: 3
  });

  google.maps.event.addListener(marker, 'click', function() {
    initChart();
    $('.chart').css(
      {
        visibility: "visible",
        display: "block"
      }
    );
    var s = (cabOccupancy[id] == 1) ? '' : 's';
    document.getElementById("pieDiv").innerHTML = '<div class="chart" data-percent="' + (cabOccupancy[id]/cabMax[id])*100 + '" id="easy-pie-chart"><span class="percent">' + cabOccupancy[id] + ' rider' + s + ' right now</span></div>';

    document.getElementById("cabDetails").innerHTML = "<br/><text style='font-size: 150%;'>Driver:</text><br/>" + cabDriver[id] + "<br/><img style='width:210px;height:210px; -webkit-border-radius: 50px;' src='" + driverPhoto[id] + "''><br/><br/>"
                                                      + "<br/><text style='font-size: 150%;'>Route:</text><br/>" + routeNames[id] + "<br/><br/>"
                                                      + "<br/><text style='font-size: 150%;'>Shift:</text><br/>" + formatAMPM(new Date(shiftStart[id])) + " - " + formatAMPM(new Date(shiftEnd[id])) + "<br/>"
                                                      + "<br/><h3 style='margin-bottom: 0px'>Cab #" + cabNumbers[id] + " is </h3><h3 style='font-size: 250%; margin: 0px'>" + cabStatusString[id] + "</h3>" ;
  });
  return marker;
}

function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
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


var myAjaxCall = function() {
  $.ajax({
      url: 'http://' + ip + ':3000/route-data',
      type: 'GET',
      dataType: 'json',
      success: function(data) {
          cabsInfo = data;
          for(var cab in data){
            routeNames[cab]   = data[cab].route_name;
            cabStatusBool[cab]= data[cab].onduty;
            cabLat[cab]       = data[cab].currentLat;
            cabLong[cab]      = data[cab].currentLong;
            cabNumbers[cab]   = data[cab].shuttle;
            cabOccupancy[cab] = data[cab].students_on_shuttle;
            cabMax[cab]       = data[cab].max;
            cabDriver[cab]    = data[cab].fname + ' ' + data[cab].lname; 
            driverPhoto[cab]  = "/uploads/" + data[cab].picture;
            shiftStart[cab]   = data[cab].shiftstart_date;
            shiftEnd[cab]     = data[cab].shiftend_date;
            cabFull[cab]      = (data[cab].students_on_shuttle >= data[cab].max) ? true : false;
            setMarkers();
          }
      },
  });
}

myAjaxCall(); // initial AJAX call
window.setInterval('myAjaxCall()', 8000); // update data every 5 seconds

google.maps.event.addDomListener(window, 'load', initialize);

var initChart = function(){

  $.getScript('js/easypiechart.js', function(){
    $('#easy-pie-chart').easyPieChart({
      animate: 2000,
      scaleColor: false,
      lineWidth: 12,
      lineCap: 'square',
      size: 200,
      trackColor: '#e5e5e5',
      barColor: '#008542'    
    });
    $('#easy-pie-chart').css({
       width : 200 + 'px',
       height : 200 + 'px'
    });
    $('#easy-pie-chart .percent').css({
      "line-height": 200 + 'px'
    });
  });
};




