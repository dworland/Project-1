$( document ).ready(function() {

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
    $('html, body').animate({scrollTop: '+=450px'}, 800);
});

var salary;
var opps;

// Create foundational variables (job selection, location)

$("#searchBtn").on("click", function() {
	var jobSelection = "";
	jobSelection = $("#jobSelection").val();
	var location = "";
	location = $("#location").val();
	var split = location.split(" ");
	console.log(split);
	console.log(split[0]);
	console.log(split[1]);

	var userIP = "";
	var userAgent = "";
	
	var queryURL1 = "http://api.glassdoor.com/api/api.htm?t.p=198273&t.k=cYTMMG3JTuQ&userip=&useragent=&format=json&v=1&action=jobs-prog&countryId=1&jobTitle=" + jobSelection; 
	var queryURL2 = "http://api.glassdoor.com/api/api.htm?t.p=198273&t.k=cYTMMG3JTuQ&userip=&useragent=&format=json&v=1&action=jobs-stats&l=" + location + "&jt=" + jobSelection + "&returnCities=true"; 
	var queryURL3 = "https://maps.googleapis.com/maps/api/geocode/json?address=" + split[0] + "%20" + split[1] + "&key=AIzaSyDsmzweBLk2kCCq3FeNX9VIqCdjhMVutrw";


	var rowId = location + Date.now();
	var btnId = 'btn' + rowId;
	var row = $("#table").append('<tr id=' + rowId + '><td>' + jobSelection + '</td><td>' + location + '</td><td class="td1">' + "Loading..." + '</td><td class="td2">' + "Loading...." + '</td><td>' + '<a class="btn-floating btn-large waves-effect waves-light red" id="' + btnId + '"><i class="material-icons">add</i></a></td></tr>');

	$.ajax({
      url: queryURL1,
      method: "GET"
    })
	.done(function(response) {
		var results = response.data;
		var salary = "$" + response.response.payLow + " - " + "$" + response.response.payHigh;
		$('.td1', "#" + rowId).text(salary);
	});

	$.ajax({
      url: queryURL2,
      method: "GET"
    })
	.done(function(response) {
		var results = response.data;
		console.log(response);
		var jobs = response.response.attributionURL;
		var opps = response.response.cities[0].numJobs;
		$('.td2', "#" + rowId).html('<a target="_blank" href=' + jobs + '>' + opps + '</a>');
	});

	$.ajax({
      url: queryURL3,
      method: "GET"
    })
    .done(function(response) {
    	var results = response.data;
    	console.log(response);
    	var coordinates = results[0].geometry.location;
    	console.log(coordinates);
    	var map = new google.maps.Map(document.getElementById("map"), {
          zoom: 4,
          center: coordinates
        });
        var marker = new google.maps.Marker({
          position: coordinates,
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

	});
});	

database.ref().on("child_added", function(snapshot) {
	var sv = snapshot.val();
	var entry = '<tr><td>' + sv.job + '</td><td>' + sv.location + '</td><td>' + sv.salary + '</td><td>' + sv.opportunities + '</td><td>' + '<a class="btn-floating btn-large waves-effect waves-light red"><i class="material-icons">add</i></a></td></tr';
	$("#test").html("tryinnnnnng");
});

/* left to do:
- Display location input on Google Maps
- Fix API authentication trouble (needs own server)
- Touch up some design elements (first table, favorites)
- User authentication (with logout)
*/
});
