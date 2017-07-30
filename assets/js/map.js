(function($){
	var mymap = L.map('map').setView([-37.8136, 144.9631], 12);
	var marker = '';
	var options = {
	  componentRestrictions: {country: 'au'}
	};
	var autocomplete = new google.maps.places.Autocomplete($("#home-address")[0], options);
	
	//Criteria
	var distanceFromSportsComplex = 400;
	var distanceFromBBQs = 500;
	//Intersection Polygons
	var sportsPolygons = [];
	var bbqPolygons = [];
	
	queue()
	 .defer(d3.csv, '../data/public_barbecues.csv')
	 .defer(d3.csv, '../data/places_of_interest.csv')
	 .await(addData);
			
	autocomplete.addListener('place_changed', refreshMap);

	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZ2VtbGxveWQiLCJhIjoiY2o1b3Y5N29pMDRhbjMzcGxqYW53M2hqNSJ9.ffXRHyzJ2SNRfXnBiothNA', {
		maxZoom: 18,
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
			'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
			'Imagery © <a href="http://mapbox.com">Mapbox</a>',
		id: 'mapbox.streets'
	}).addTo(mymap);
	
	function addData(error, bbqs, pois) {
		//Draw buffered barbeque locations 			
		bbqs.forEach(function(d) {
			bbqPolygons = drawBuffer(d,distanceFromBBQs,"#ff7800");
		});
				
		//Draw buffered sports complex locations		
		//Retrieve the filter
		sportsFilter = filterCreator("subtheme","Major Sports Recreation Facility");
		//filter the data
		filtered = pois.filter(sportsFilter);
		filtered.forEach(function(d) {
			sportsPolygons = drawBuffer(d,distanceFromSportsComplex,"#FF4500");
		});
		
		//Creates a filter based on a field and criteria
		function filterCreator(field, criteria){
		
		  return function(element){
		  
			return element[field] == criteria;
		  }
		
		}
			
		function drawBuffer(d, buffer_radius, fill_color){
			latitude = +d.latitude;
			longitude = +d.longitude;
			
			//Convert point to feature
			var feature = {
				"type": "Feature",
				"properties": {},
				"geometry": {
				"type": "Point",
				"coordinates": [longitude, latitude]
				}
			};
			
			 var buffered = turf.buffer(feature, buffer_radius, 'meters');
			//Style for features
			var featureStyle = {
				"color": fill_color,
				"weight": 0.1,
				"opacity": 0.2,
				"fillColor": fill_color
			};
	
			L.geoJson(buffered,{
			   style: featureStyle
			}).addTo(mymap);
			
			return buffered;
		}	
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
		mymap.flyTo([newLat, newLng], 16);
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
	