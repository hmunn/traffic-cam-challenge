// List of Seattle Traffic Cameras
// http://data.seattle.gov/resource/65fc-btcc.json

"use strict";

//put your code here to create the map, fetch the list of traffic cameras
//and add them as markers on the map
//when a user clicks on a marker, you should pan the map so that the marker
//is at the center, and open an InfoWindow that displays the latest camera
//image
//you should also write the code to filter the set of markers when the user
//types a search phrase into the search box

$(document).ready(function(){
	var mapElem = document.getElementById('map');

	var center = {
		lat: 47.6,
		lng: -122.3
	}

	var map = new google.maps.Map(mapElem, {
		center: center,
		zoom: 12
	});

	var image = 'img/camera.png';

	var cameras;
	var locations = [];
	var infoWindow = new google.maps.InfoWindow();

	$(window).resize(function(){
		$('#map').css({
			'height' : $(window).height() - $('#map').position().top - 20
		});
	});

	$.getJSON('http://data.seattle.gov/resource/65fc-btcc.json')
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
				google.maps.event.addListener(location, 'click', function(){
					map.panTo(this.getPosition());
					var windowHtml = "<div class='cameraDetail'><p>" + camera.cameralabel + "</p>"
					windowHtml += "<img class='cameraImg' src='" + camera.imageurl.url + "' /></div>"
					infoWindow.setContent(windowHtml);
					infoWindow.open(map, this);
				});

				google.maps.event.addListener(map, 'click', function(){
					infoWindow.close();
				});

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
		.fail(function(error){
			console.log(error);
		})
		.always(function(){
			$('#ajax-loader').fadeOut();
	});
});// end document on ready