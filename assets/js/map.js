(function($){
	var mymap = L.map('map').setView([-35.307500, 149.124417], 14);
	var marker = '';
	var options = {
	  componentRestrictions: {country: 'au'}
	};
	var autocomplete = new google.maps.places.Autocomplete($("#home-address")[0], options);
	autocomplete.addListener('place_changed', refreshMap);

	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZ2VtbGxveWQiLCJhIjoiY2o1b3Y5N29pMDRhbjMzcGxqYW53M2hqNSJ9.ffXRHyzJ2SNRfXnBiothNA', {
		maxZoom: 18,
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
			'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
			'Imagery © <a href="http://mapbox.com">Mapbox</a>',
		id: 'mapbox.streets'
	}).addTo(mymap);
	
	$.ajax({
        type: "GET",
        url: "../data/Skate_Parks.csv",
        dataType: "text",
        success: function(data) {
	        processData(data);
	    }
     });
     
	function processData(latLng) {
		var markerData = $.csv.toObjects(latLng);
		var result = '';
    	var newPolygon = {};
		
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
			newPolygon = buffered;
			var myStyle = {
			    "color": "#ff0000",
			    "weight": 0,
			    "opacity": 0.85
			};
			L.geoJSON(buffered, {
				style: myStyle,
			}).addTo(mymap);
			
			
			var intersection = turf.intersect(buffered, newPolygon);
			console.log(intersection);
	  	});
	  	
	  	
	}
	
	
	
	
	$(".option-block h3").on("click", function() {
		$(this).parent().toggleClass("expanded");
	});
	
	function refreshMap() {
		// Get the place details from the autocomplete object.
        var place = autocomplete.getPlace();
		var newLat = place.geometry.location.lat();
		var newLng = place.geometry.location.lng();
		if(marker !== '') {
			mymap.removeLayer(marker);
		}
		marker = new L.marker([newLat, newLng]).addTo(mymap);
		mymap.setView([newLat, newLng], 16);
	}
	
	// Bias the autocomplete object to the user's geographical location,
	  // as supplied by the browser's 'navigator.geolocation' object.
	  function geolocate() {
	    if (navigator.geolocation) {
	      navigator.geolocation.getCurrentPosition(function(position) {
	        var geolocation = {
	          lat: position.coords.latitude,
	          lng: position.coords.longitude
	        };
	        var circle = new google.maps.Circle({
	          center: geolocation,
	          radius: position.coords.accuracy
	        });
	        autocomplete.setBounds(circle.getBounds());
	      });
	    }
	  }
	
})(jQuery);	
	