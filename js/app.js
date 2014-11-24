// List of Seattle Traffic Cameras
// http://data.seattle.gov/resource/65fc-btcc.json

"use strict";

$(document).ready(function(){
	var mapElem = document.getElementById('map');

	//initial window sizing
	size();
	
	//map resizes on window size change
	$(window).resize(function(){
		size();
	});

	//created function to DRY window sizing
	function size(){
		$('#map').css({
			'height' : $(window).height() - $('#map').position().top - 20
		});
	}
	
	//center
	var center = {
		lat: 47.6,
		lng: -122.3
	}
	
	//map constructor
	var map = new google.maps.Map(mapElem, {
		center: center,
		zoom: 12,
	});

	//for each variables
	var image = 'img/camera.png';
	var cameras;
	var locations = [];
	var infoWindow = new google.maps.InfoWindow();

	//gets camera data
	$.getJSON('http://data.seattle.gov/resource/65fc-btcc.json')
		//success
		.done(function(data) {
			cameras = data;

			data.forEach(function(camera){
				var location = new google.maps.Marker({
					position: {
						lat: Number(camera.location.latitude),
						lng: Number(camera.location.longitude)
					},
					icon: image,
					map : map
				});
				locations.push(location);
				//infoWindow click and content
				google.maps.event.addListener(location, 'click', function(){
					map.panTo(this.getPosition());
					var windowHtml = "<div class='cameraDetail'><img class='cameraImg' src='" + camera.imageurl.url + "' />";
					windowHtml += "<p>" + camera.cameralabel + "</p></div>";
					infoWindow.setContent(windowHtml);
					infoWindow.open(map, this);
				});
				//infoWindow close
				google.maps.event.addListener(map, 'click', function(){
					infoWindow.close();
				});
				//camera search
				$('#search').bind('search keyup', function(){
					var searchString = $(this).val().toLowerCase();

					if(camera.cameralabel.toLowerCase().indexOf(searchString) >= 0){
						location.setMap(map);
					}else{
						location.setMap(null);
					}
				});
			});
		})
		//fail
		.fail(function(error){
			window.alert(error);
		})
		//always
		.always(function(){
			$('#ajax-loader').fadeOut();
		});
});// end document on ready

