$( document ).ready(function() {

$(".button-collapse").sideNav();

var slideIndex = 0;
carousel();

function carousel() {
    var i;
    var x = $(".carousel-img");
    // console.log(x);
    for (i = 0; i < x.length; i++) {
      x[i].style.display = "none";
    }
    slideIndex++;
    if (slideIndex > x.length) {slideIndex = 1}
    x[slideIndex-1].style.display = "block";
    setTimeout(carousel, 4000); 
};

// Initiate firebase

var config = {
    apiKey: "AIzaSyDhzkzYM0pWB2A-KYGdw-_o046jiV_VTcE",
    authDomain: "project-1-jf.firebaseapp.com",
    databaseURL: "https://project-1-jf.firebaseio.com",
    projectId: "project-1-jf",
    storageBucket: "",
    messagingSenderId: "111092817794"
};

firebase.initializeApp(config);

var database = firebase.database();

$("#scroll").click(function(event){
    $('html, body').animate({scrollTop: '+=600px'}, 800);
});

var salary;
var opps;

// Display USA map on home screen

var usa = "United States";
var queryURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + usa + "&key=AIzaSyDsmzweBLk2kCCq3FeNX9VIqCdjhMVutrw";

$.ajax({
      url: queryURL,
      method: "GET",
    })
    .done(function(response) {
    	var results = response.results;
    	console.log('response',response);
    	var coordinates = response.results[0].geometry.location
    	console.log('coordinates',coordinates);
    	var latlng = new google.maps.LatLng(coordinates);
    	var mapOptions =
    	{
          zoom: 4,
          center: latlng,
          mapTypeId: google.map
        };

        map = new google.maps.Map(document.getElementById("map"), mapOptions);

});

// Create foundational variables (job selection, location)

$("#searchBtn").on("click", function() {
	var jobSelection = "";
	jobSelection = $("#jobSelection").val();
	var location = "";
	location = $("#location").val();
	var locationSplit = location.split(" ");
	console.log(locationSplit);
	console.log(locationSplit[0]);
	console.log(locationSplit[1]);
	console.log(locationSplit[2]);

	var userIP = "";
	var userAgent = "";
	
	var queryURL1 = "https://api.glassdoor.com/api/api.htm?t.p=198273&t.k=cYTMMG3JTuQ&userip=&useragent=&format=json&v=1&action=jobs-prog&countryId=1&jobTitle=" + jobSelection; 
	var queryURL2 = "https://api.glassdoor.com/api/api.htm?t.p=198273&t.k=cYTMMG3JTuQ&userip=&useragent=&format=json&v=1&action=jobs-stats&l=" + locationSplit[0] + "%20" + locationSplit[1] + "&jt=" + jobSelection + "&returnCities=true"; 
	var queryURL3 = "https://api.glassdoor.com/api/api.htm?t.p=198273&t.k=cYTMMG3JTuQ&userip=&useragent=&format=json&v=1&action=jobs-stats&l=" + locationSplit[0] + "%20" + locationSplit[1] + "%20" + locationSplit[2] + "&jt=" + jobSelection + "&returnCities=true";
	var queryURL4 = "https://maps.googleapis.com/maps/api/geocode/json?address=" + locationSplit[0] + "%20" + locationSplit[1] + "&key=AIzaSyDsmzweBLk2kCCq3FeNX9VIqCdjhMVutrw";

	var query;
	var map;
	var rowId = Date.now();
	var btnId = 'btn' + rowId;
	var row = $("#table").append('<tr id=' + rowId + '><td>' + jobSelection + '</td><td>' + location + '</td><td class="td1">' + "Loading..." + '</td><td class="td2">' + "Loading...." + '</td><td>' + '<a class="btn-floating btn-large waves-effect waves-light red" id="' + btnId + '"><i class="material-icons">add</i></a></td></tr>');

	$.ajax({
      url: queryURL1,
      method: "GET",
      jsonp: "callback",
      dataType: "jsonp"
    })
	.done(function(response) {
		var results = response.data;
		var salary = "$" + response.response.payLow + " - " + "$" + response.response.payHigh;
		$('.td1', "#" + rowId).text(salary);
	});


	if (locationSplit.length === 3) {
		query = queryURL3;
		console.log(query);

	}
	else if (locationSplit.length === 2) {
		query = queryURL2;
		console.log(query);
	}


	$.ajax({

      url: query,
      method: "GET",
      jsonp: "callback",
      dataType: "jsonp"
    })
	.done(function(response) {
		var results = response.data;
		console.log(response);
		var jobs = response.response.attributionURL;
		console.log(jobs);
		var opps = response.response.cities[0].numJobs;
		console.log(opps);
		$('.td2', "#" + rowId).html('<a target="_blank" href="' + jobs + '">' + opps + '</a>');
	});

	$.ajax({
      url: queryURL4,
      method: "GET",
    })
    .done(function(response) {
    	var results = response.results;
    	console.log('response',response);
    	var coordinates = response.results[0].geometry.location
    	console.log('coordinates',coordinates);
    	var latlng = new google.maps.LatLng(coordinates);
    	var mapOptions =
    	{
          zoom: 4,
          center: latlng,
          mapTypeId: google.map
        };

        map = new google.maps.Map(document.getElementById("map"), mapOptions);

        var marker = new google.maps.Marker({
          position: latlng,
          map: map
        });

    });

	// Will need to append to firebase // Favorites table will need to reflect firebase results snapshot
	$('#btn' + rowId).on("click", function() {
		var salary = $('.td1', "#" + rowId).text();
		var opps = $('.td2', "#" + rowId).text();

		database.ref().push({
	        job: jobSelection,
	        location: location,
	        salary: salary,
	        opportunities: opps,
      	});

    $(this).removeClass("orange");
    $(this).addClass("green");

	});
});	

database.ref().on("child_added", function(snapshot) {
	var sv = snapshot.val();
  var key = snapshot.key;
  var entry = '<tr><td>' + sv.job + '</td><td>' + sv.location + '</td><td>' + sv.salary + '</td><td>' + sv.opportunities + '</td><td>' + '<a class="btn-floating btn-large waves-effect waves-light red" id="' + key + '"><i class="material-icons">add</i></a></td></tr';
});

});
