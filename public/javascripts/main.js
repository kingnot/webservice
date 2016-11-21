/*
 * Author: Fei Wang
 * Date: Oct 27, 2016
 * Customized Javascripts go here 
 */

$(document).ready(function() {
	// stop the form from submitting the normal way and refreshing the page
	event.preventDefault();
	// validate the input of the user form by jQuery Validation plug-in
	$("form[name='userForm']").validate({
		// Specify validation rules
		rules: {
		  firstname: "required",
		  lastname: "required",
		  email: {
		    required: true,
		    // Specify that email should be validated by the built-in "email" rule
		    email: true
		  },
		  city: "required"
		},
		// Specify validation error messages
		messages: {
		  firstname: "Please enter your firstname",
		  lastname: "Please enter your lastname",
		  email: "Please enter a valid email address",
		  city: "Please enter the city you live in"
		},
		// after validation is passed
		submitHandler: function(form) {
		  var fnameString = $("input#firstname").val();
			var lnameString = $("input#lastname").val();
			var emailString = $("input#email").val();
			var cityString = $("input#city").val();
			var latitude = '';
			var longitude = '';
			var geoString = '';	//geographic info
			var geocoder =  new google.maps.Geocoder();	//make a new google map geocoder

			// Asynchronous function with Google Geocoding to get Latitude and Longitude of a given address
			function getLatLng(address, fn){
				geocoder.geocode({'address': address, 'componentRestrictions': {country: 'Canada'}}, function(results, status){
					var validCity = false;
					if (status == google.maps.GeocoderStatus.OK) {	// if Geocoder runs successfully
						if (results[0]){	//if there is a matching result from Google Geocoder
							latitude = results[0].geometry.location.lat();							
							longitude = results[0].geometry.location.lng();
							addressResult = results[0].formatted_address;								
							formattedAddress = addressResult.split(",");	
							if (formattedAddress[0].toUpperCase() != cityString.toUpperCase()) {								
								geoString = "We've found the most likely place: " + addressResult;
							}
							else {
								geoString = address + '  (Latitude: ' + latitude 
										+ '  Longitude: ' + longitude + ")";
								validCity = true;								
							}
						}
						else {
							geoString = 'Ops, this is an unknown city to us.'
							$('#city').focus();
						}						
					}
					else {
						geoString = 'Geocoder failed due to: ' + status;
					}

					fn(geoString, validCity, addressResult);
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

			getLatLng(cityString, function(geo, valid_city, address_result){
				addressResult = address_result;
				// use jQuery simple weather to get the current weather of a given city
				if (cityString.length) {
					$.simpleWeather({
					    location: address_result,
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
			});

			// Take input data into a json form
			var inputData = {
				'firstname': fnameString,
				'lastname': lnameString,
				'email': emailString,
				'city': cityString
			};

			getLatLng(cityString, function(geo, valid_city, address_result){
				geoString = geo;
				validCity = valid_city;
				// make sure required fields are not empty, email is in proper format 
				// and a valid city name before giving response
				if (fnameString.length && lnameString.length 
							&& emailString.length && cityString.length 
							&& isEmail(emailString)) {
					//AJAX call to display input sting below form with coresponding response
					$.ajax({
						type: "POST",
						url: "/",
						data: validCity ? inputData : null,
						dataType: 'json',
						success: function() {								
							document.getElementById('message-response').innerHTML = "Thank you, " + fnameString + " " 
								+ lnameString + ". Your account has been created." + "<br/>"+ "We will send a confirmation email to " 
								+ emailString + " shortly." + "<br/><br/>" + geoString;					
						},
						error: function(error) {
							document.getElementById('message-response').innerHTML = "<p>" + error + "</p>";
						}
					});
				}			
			});

		}
	});		


});