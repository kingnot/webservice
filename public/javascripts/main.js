/* Customized Javascripts go here */
$(document).ready(function() {
	$('#submitbutton').click(function(event){
		var fnameString = $("input#firstname").val();;
		var lnameString = $("input#lastname").val();
		var emailString = $("input#email").val();
		var cityString = $("input#city").val();
		var latitude = '';
		var longitude = '';
		var geoString = '';	//geographic info
		var geocoder =  new google.maps.Geocoder();	//make a new google map geocoder

		// Asynchronous function with Google Geocoding to get Latitude and Longitude of a given address
		function getLatLng(address, fn){
			geocoder.geocode({'address': address}, function(results, status){
				if (status == google.maps.GeocoderStatus.OK) {
					if (results[0]){
						latitude = results[0].geometry.location.lat();							
						longitude = results[0].geometry.location.lng();								
						geoString = address + '  (Latitude: ' + latitude 
									+ '  Longitude: ' + longitude + ")";
					}
					else {
						geoString = 'Ops, this is an unknown city to us.'
					}						
				}
				else {
					geoString = 'Geocoder failed due to: ' + status;
				}

				fn(geoString);
			});									
		}

		/* 
		 * This function is used to test if a string is email format 
		 * return boolean
		 */
		function isEmail(email) {
		  var regex = /^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]/;
		  return regex.test(email);
		}

		// use jQuery simple weather to get the current weather of a given city
		if (cityString.length) {
			$.simpleWeather({
			    location: cityString,
			    woeid: '',
			    unit: 'c',
			    success: function(weather) {
			    	$("#message-weather").html('<p><i class="icon-'+ weather.code + '"></i></p> '
			    		+ '<p class="currently">' + weather.currently + '    ' + weather.temp 
			    		+ '&deg;'+ weather.units.temp + '</p>');
			    },
			    error: function(error) {
					$("#message-weather").html('<p>' + error + '</p>');
				}
			});
		}

		// Take input data into a json form
		var inputData = {
			'firstname': fnameString,
			'lastname': lnameString,
			'email': emailString,
			'city': cityString
		};
		//AJAX call to display input sting below form
		$.ajax({
			type: "POST",
			url: "/",
			data: inputData,
			dataType: 'json',
			success: function() {
				getLatLng(cityString, function(geo){
					geoString = geo;
					// make sure required fields are not empty and email is in proper format before giving response
					if (fnameString.length && lnameString.length 
						&& emailString.length && cityString.length && isEmail(emailString)) {
						document.getElementById('message-response').innerHTML = "Thank you, " + fnameString + " " + lnameString + ". Your account has been created." + "<br/>"+ "We will send a confirmation email to " + emailString + " shortly." + "<br/><br/>" + geoString;
					}
				});					
			}
		});
		// stop the form from submitting the normal way and refreshing the page
        event.preventDefault();
	});
});