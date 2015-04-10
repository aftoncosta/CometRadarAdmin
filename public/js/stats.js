// Initalize jQuery Datepicker
$(function() {
	$( "#datepicker" ).datepicker({
		dateFormat: 'mm/dd/yy'
	});
	$('#datepicker').datepicker().datepicker('setDate',new Date());

	$( "#datepicker2" ).datepicker({
		dateFormat: 'mm/dd/yy'
	});
	$('#datepicker2').datepicker().datepicker('setDate',new Date());
});
      

USGSOverlay.prototype = new google.maps.OverlayView();
var overlay, map, pointarray, heatmap, init = false, routeName = "All", startDate, endDate, cabData = [];


// Initialize the map and the custom overlay.
function initialize() {
	
	createMap();
	updateMap();
	//createHeatMap();
}

function createMap(){
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

function createHeatMap(){
	// create heatmap
	//cabData = [];
	//heatmap.setData(new google.maps.MVCArray(cabData));
	//toggleHeatmap();
	var pointArray = heatmap = null;
	var pointArray = new google.maps.MVCArray(cabData);
	heatmap = new google.maps.visualization.HeatmapLayer({
	  data: pointArray
	});

	heatmap.setMap(map);
	changeRadius();
	changeGradient();
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

function toggleHeatmap() {
	heatmap.setMap(heatmap.getMap() ? null : map);
}

function changeGradient() {
	var gradient = [
	  'rgba(0, 255, 255, 0)',
	  'rgba(0, 255, 255, 1)',
	  'rgba(0, 191, 255, 1)',
	  'rgba(0, 127, 255, 1)',
	  'rgba(0, 63, 255, 1)',
	  'rgba(0, 0, 255, 1)',
	  'rgba(0, 0, 223, 1)',
	  'rgba(0, 0, 191, 1)',
	  'rgba(0, 0, 159, 1)',
	  'rgba(0, 0, 127, 1)',
	  'rgba(63, 0, 91, 1)',
	  'rgba(127, 0, 63, 1)',	
	  'rgba(191, 0, 31, 1)',
	  'rgba(255, 0, 0, 1)'
	]
	heatmap.set('gradient', heatmap.get('gradient') ? null : gradient);
}

function changeRadius() {
	heatmap.set('radius', heatmap.get('radius') ? null : 20);
}

function changeOpacity() {
	heatmap.set('opacity', heatmap.get('opacity') ? null : 0.2);
}

function changeRoute(name) {
	routeName = name;
	document.getElementById("dropdown-main").innerText = routeName;
}

function updateMap(){

	var hourlyCounts = [0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	var hourlyDivs = ["eight", "nine", "ten", "eleven", "twelve", "one", "two", "three", "four", "five", "six", "seven", "eightPM", "ninePM"];
	startDate = $("#datepicker").datepicker('getDate');
	startDate = startDate.toISOString().slice(0, 10).replace('T', ' ');

	endDate = $("#datepicker2").datepicker('getDate');
	endDate = endDate.toISOString().slice(0, 10).replace('T', ' ');


	$.ajax({
		url: 'http://127.0.0.1:3000/stops?route=' + routeName + '&startDate=' + startDate + '&endDate=' + endDate,
		type: 'GET',
		dataType: 'json',
		timeout: 5000,
		success: function(data) {
			cabData = [];	
			if(init)
				toggleHeatmap();
			else
				init = true;
					
		    for(var i in data){
		        cabData[i] = new google.maps.LatLng(data[i].lat, data[i].long);
		        console.log(data[i].date);
		        switch(data[i].date){
		        	case "08": hourlyCounts[0]++; break;
		        	case "09": hourlyCounts[1]++; break;
		        	case "10": hourlyCounts[2]++; break;
		        	case "11": hourlyCounts[3]++; break;
		        	case "12": hourlyCounts[4]++; break;
		        	case "13": hourlyCounts[5]++; break;
		        	case "14": hourlyCounts[6]++; break;
		        	case "15": hourlyCounts[7]++; break;
		        	case "16": hourlyCounts[8]++; break;
		        	case "17": hourlyCounts[9]++; break;
		        	case "18": hourlyCounts[10]++; break;
		        	case "19": hourlyCounts[11]++; break;
		        	case "20": hourlyCounts[12]++; break;
		        	case "21": hourlyCounts[13]++; break;
		        }
		    }
		    createHeatMap();
		    for (var h in hourlyCounts){
		    	document.getElementById(hourlyDivs[h]).innerText = hourlyCounts[h];
		    }
		},
		error: function(jqXHR, textStatus, errorThrown) {
		    alert('error ' + textStatus + " " + errorThrown);
		}
	});
}

$.ajax({
	url: 'http://127.0.0.1:3000/route-names',
	type: 'GET',
	dataType: 'json',
	timeout: 5000,
	success: function(data) {

		document.getElementById("route-list").innerHTML = '<li><a onclick="changeRoute(' + "'All'" + ')">All</a></li>';
	    
	    for(var i in data){
	        document.getElementById("route-list").innerHTML = document.getElementById("route-list").innerHTML 
	                                                        + '<li><a onclick="changeRoute(' + "'" 
	                                                        + data[i].route_name + "'" + ')">'
	                                                        + data[i].route_name + '</a></li>';
	    }
	},
	error: function(jqXHR, textStatus, errorThrown) {
	    alert('error ' + textStatus + " " + errorThrown);
	}
});

google.maps.event.addDomListener(window, 'load', initialize);