(function($){
	var mymap = L.map('map').setView([-35.307500, 149.124417], 14);
	
	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZ2VtbGxveWQiLCJhIjoiY2o1b3Y5N29pMDRhbjMzcGxqYW53M2hqNSJ9.ffXRHyzJ2SNRfXnBiothNA', {
		maxZoom: 18,
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
			'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
			'Imagery © <a href="http://mapbox.com">Mapbox</a>',
		id: 'mapbox.streets'
	}).addTo(mymap);
	
	$.ajax({
        type: "GET",
        url: "test.csv",
        dataType: "text",
        success: function(data) {
	        processData(data);
	    }
     });
     
	function processData(latLng) {
		var markerData = $.csv.toObjects(latLng);
		var result = '';
		var mapLayers = {};
		
		$.each(markerData, function(key, value) {
	    	var lat = parseFloat(value.LATITUDE);
	    	var lng = parseFloat(value.LONGITUDE);
	    	var point = {
			  "type": "Feature",
			  "properties": {},
			  "geometry": {
			    "type": "Point",
			    "coordinates": [lng, lat]
			  }
			};
			var buffered = turf.buffer(point, 10);
			var myStyle = {
			    "color": "#ff0000",
			    "weight": 0,
			    "opacity": 0.85
			};
			L.geoJSON(buffered, {
				style: myStyle,
			}).addTo(mymap);
	  	});
	}
	
	L.circle([51.508, -0.11], {
		color: 'red',
		fillColor: '#f03',
		fillOpacity: 0.5,
		radius: 500
	}).addTo(mymap);
})(jQuery);	
	