(function($){
	var mymap = L.map('map').setView([-35.2809, 149.1300], 13);
	var marker = '';
	var options = {
	  componentRestrictions: {country: 'au'}
	};
	var autocomplete = new google.maps.places.Autocomplete($("#home-address")[0], options);
	
	//Criteria
	var distanceFromSportsComplex = 100;
	var distanceFromBBQs = 500;
	
	//Intersection Polygons
	var mapLayer = [];
	var actbbqPolygons = [];
	var dogparkPolygons = [];
	var actskatePolygons = [];
	var actfitnessPolygons = [];
	var bballPolygons = [];
	var fitnessPolygons = [];
	var dogparkPolygons = [];
	var vicbbqPolygons = [];
	var vicbballPolygons = [];
	var vicdogparkPolygons = [];
	var vicaquaPolygons = [];
	var vicplaygroundPolygons = [];
	var sportsPolygons = [];
	var wyndhamPolygons = [];
	var bbqLayer = [];
	var counter = 0;
	
	queue()
	 .defer(d3.csv, '../data/act_basketball_courts.csv')
	 .defer(d3.csv, '../data/act_fenced_dog_parks.csv')
	 .defer(d3.csv, '../data/act_fitness_sites.csv')
	 .defer(d3.csv, '../data/act_public_bbqs.csv')
	 .defer(d3.csv, '../data/act_skate_parks.csv')
	 .defer(d3.csv, '../data/vic_aquatic_parks.csv')
	 .defer(d3.csv, '../data/vic_brimbank_playgrounds.csv')
	 .defer(d3.csv, '../data/vic_dog_off_leash.csv')
	 .defer(d3.csv, '../data/vic_golden_plains_Basketball_Courts.csv')
	 .defer(d3.csv, '../data/vic_places_of_interest.csv')
	 .defer(d3.csv, '../data/vic_public_barbecues.csv')
	 .await(addData);
			
	autocomplete.addListener('place_changed', refreshMap);

	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZ2VtbGxveWQiLCJhIjoiY2o1b3Y5N29pMDRhbjMzcGxqYW53M2hqNSJ9.ffXRHyzJ2SNRfXnBiothNA', {
		maxZoom: 18,
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
			'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
			'Imagery © <a href="http://mapbox.com">Mapbox</a>',
		id: 'mapbox.streets'
	}).addTo(mymap);
	
	function addData(error, actbball, dogparks, fitness, actbbq, actskate, vicaqua, vicplayground, vicdogpark, vicbball, vicpois, vicbbqs) {
		
		
		//Draw buffered locations for all variables
		actbball.forEach(function(d) {
			bballPolygons = drawBuffer(d,distanceFromBBQs,"#ff7800", "");
		});
		
		dogparks.forEach(function(d) {
			dogparkPolygons = drawBuffer(d,distanceFromBBQs,"#ff7800", "");
		});
		
		fitness.forEach(function(d) {
			actfitnessPolygons = drawBuffer(d,distanceFromBBQs,"#ff7800", "");
		});
				
		actbbq.forEach(function(d) {
			actbbqPolygons = drawBuffer(d,distanceFromBBQs,"#ff7800", bbqLayer);
		});
		
		actskate.forEach(function(d) {
			actskatePolygons = drawBuffer(d,distanceFromBBQs,"#ff7800", "");
		});
		
		vicaqua.forEach(function(d) {
			vicaquaPolygons = drawBuffer(d,distanceFromBBQs,"#ff7800", "");
		});
		
		vicbball.forEach(function(d) {
			vicbballPolygons = drawBuffer(d,distanceFromBBQs,"#ff7800", "");
		});
		
		vicplayground.forEach(function(d) {
			vicplaygroundPolygons = drawBuffer(d,distanceFromBBQs,"#ff7800", "");
		});
		
		vicdogpark.forEach(function(d) {
			vicdogparkPolygons = drawBuffer(d,distanceFromBBQs,"#ff7800", "");
		});
		
		vicbbqs.forEach(function(d) {
			vicbbqPolygons = drawBuffer(d,distanceFromBBQs,"#ff7800", "");
		});
		
		//Add Wyndham via AJAX
		$.ajax({ 
	        type: "GET", 
	        url: "../data/wyndham_public_bbq.json", 
	        dataType: "json", 
	        success: function(data) { 
		        data.features.forEach(function(d) {
			        var buffered = turf.buffer(d, distanceFromBBQs, 'meters');
			        
					var featureStyle = {
						"color": "#ff7800",
						"weight": 0.1,
						"opacity": 0.3,
						"fillColor": "#ff7800"
					};
			
					L.geoJson(buffered,{
					   style: featureStyle
					}).addTo(mymap); 				
				});
	      	} 
	     }); 
	     
		//Draw buffered sports complex locations		
		//Retrieve the filter
		sportsFilter = filterCreator("subtheme","Major Sports Recreation Facility");
		//filter the data
		filtered = vicpois.filter(sportsFilter);
		filtered.forEach(function(d) {
			sportsPolygons = drawBuffer(d,distanceFromSportsComplex,"#FF4500", 0.2);
		});
		//Creates a filter based on a field and criteria
		function filterCreator(field, criteria){
		
		  return function(element){
		  
			return element[field] == criteria;
		  }
		
		}
			
		function drawBuffer(d, buffer_radius, fill_color, layerName){
			latitude = +d.LATITUDE;
			longitude = +d.LONGITUDE;
			
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
				"opacity": 0.3,
				"fillColor": fill_color
			};
			
			if(layerName !== "") {
				layerName = L.geoJson(buffered,{
				   style: featureStyle
				}).addTo(mymap);
				
				layerName.eachLayer(function (layer) {
				    layer._path.id = 'feature-bbq-' + counter;
				    counter++;
				});
			} else {
				L.geoJson(buffered,{
				   style: featureStyle
				}).addTo(mymap);
			}
			
			counter++;
			return buffered;
		}	
	}
	
	//Accordion Script
	$(".option-block h3").on("click", function() {
		$(this).parent().toggleClass("expanded");
	});
	
	
	//Function to recenter the map around the person's desired address
	function refreshMap() {
		// Get the place details from the autocomplete object.
        var place = autocomplete.getPlace();
		var newLat = place.geometry.location.lat();
		var newLng = place.geometry.location.lng();
		var selected_option = $('#distance option:selected');
		$("#address-disclaimer").remove();
		$("path[id^='home-layer-']").remove();	
		if(marker !== '') {
			mymap.removeLayer(marker);
		}
		marker = new L.marker([newLat, newLng]).addTo(mymap);
		mymap.flyTo([newLat, newLng], 16);
		
		if(selected_option[0].value !== "") {
			var markerPosition = marker.getLatLng();
			
			var feature = {
				"type": "Feature",
				"properties": {},
				"geometry": {
				"type": "Point",
				"coordinates": [markerPosition.lng, markerPosition.lat]
				}
			};
		
			var buffered = turf.buffer(feature, selected_option[0].value, 'meters');
			//Style for features
			var featureStyle = {
				"color": "#000",
				"weight": 0.1,
				"opacity": 0.7,
				"fillColor": "#000"
			};
			
			var homeLayer = L.geoJson(buffered,{
			   style: featureStyle
			}).addTo(mymap);
			
			homeLayer.eachLayer(function (layer) {
			    layer._path.id = 'home-layer-' + counter;
			    counter++;
			});
		} 
	}

	  //Clear facility if unchecked, reshow if checked
	$('.single-option :checkbox').change(function () {
		if(!$(this).is(":checked")) {
			clearBuffer($(this).attr("id"));
		} else {
			readdBuffer($(this).attr("id"));
		}
	});
	
	//Adjust radius of circle if an address has been selected
	$('#distance').on('change', function() {
		var distanceValue = $(this).val();
		var checkAddress = $("#home-address").val();
		
		if(checkAddress == "") {
			if($("#address-disclaimer").length > 0) {
				$("<p id='address-disclaimer'>Please enter your address first before selecting a distance.</p>").appendTo(".distance-block");
			}
		} else {
			$("#address-disclaimer").remove();
			$("path[id^='home-layer-']").remove();	
			var markerPosition = marker.getLatLng();
			
			var feature = {
				"type": "Feature",
				"properties": {},
				"geometry": {
				"type": "Point",
				"coordinates": [markerPosition.lng, markerPosition.lat]
				}
			};
		
			var buffered = turf.buffer(feature, distanceValue, 'meters');
			//Style for features
			var featureStyle = {
				"color": "#000",
				"weight": 0.1,
				"opacity": 0.7,
				"fillColor": "#000"
			};
			
			var homeLayer = L.geoJson(buffered,{
			   style: featureStyle
			}).addTo(mymap);
			
			homeLayer.eachLayer(function (layer) {
			    layer._path.id = 'home-layer-' + counter;
			    counter++;
			});
		}
	});
	
	function clearBuffer(clearItem) {
		if(clearItem == "bbq-pit") {     
			var $eles = $("path[id^='feature-bbq-']").css("opacity","0.0");			
		}	
	}
	
	function readdBuffer(clearedItem) {
		if(clearedItem == "bbq-pit") {
			var $eles = $("path[id^='feature-bbq-']").css("opacity","0.3"); 
		}	
	}
}
	
)(jQuery);	