
  USGSOverlay.prototype = new google.maps.OverlayView();

  var overlay, map, pointarray, heatmap;
  var rendererOptions = {
    suppressMarkers: true,
    draggable: false,

  };
  var directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
  var directionsService = new google.maps.DirectionsService();



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


    directionsDisplay.setMap(map);
    directionsDisplay.setPanel(document.getElementById('directionsPanel'));
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
    //calcRoute()
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

  function calcRoute(olat, olong, dlat, dlong, wp) {

    var request = {
      origin: new google.maps.LatLng(olat, olong),
      destination: new google.maps.LatLng(dlat, dlong),
      waypoints: wp,
      travelMode: google.maps.TravelMode.DRIVING
    };
    directionsService.route(request, function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
      }
    });
  }

  function changeRoute(name) {
    $("#dropdown-main").text(name);
    //document.getElementById("dropdown-main").innerText = name;

    $.ajax({
    url: 'http://127.0.0.1:3000/route-waypoints?route=' + name, 
    type: 'GET',
    dataType: 'json',
    success: function(data) {
      var waypts = [];

      for(var i in data){
          if(data[i].wp_lat != null){
            waypts.push({
                location:new google.maps.LatLng(data[i].wp_lat, data[i].wp_long)
            });
          }
      }
      calcRoute(data[0].originLat, data[0].originLong, data[0].destLat, data[0].destLong, waypts);
    },

    error: function(jqXHR, textStatus, errorThrown) {
        alert('error ' + textStatus + " " + errorThrown);
    }
  });
    
  }


  google.maps.event.addDomListener(window, 'load', initialize);

  $.ajax({
    url: 'http://127.0.0.1:3000/route-names',
    type: 'GET',
    dataType: 'json',
    success: function(data) {

        document.getElementById("dropdown-main").innerText = data[0].route_name;
        
        for(var i in data){
            document.getElementById("route-list").innerHTML = document.getElementById("route-list").innerHTML 
                                                            + '<li><a onclick="changeRoute(' + "'" 
                                                            + data[i].route_name + "'" + ')">'
                                                            + data[i].route_name + '</a></li>';
        }
        changeRoute(data[0].route_name);
    },
    error: function(jqXHR, textStatus, errorThrown) {
        alert('error ' + textStatus + " " + errorThrown);
    }
});