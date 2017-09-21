$( document ).ready(function() {


var slideIndex = 0;
carousel();

function carousel() {
    var i;
    var x = $(".carousel-img");
    console.log(x);
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


// Create foundational variables (job selection, location)

$("#searchBtn").on("click", function() {
	var jobSelection = "";
	jobSelection = $("#jobSelection").val();
	var location = "";
	location = $("#location").val();

	var userIP = "";
	var userAgent = "";

	// Job stats link // var queryURL = "http://api.glassdoor.com/api/api.htm?v=1&format=json&t.p=198273&t.k=cYTMMG3JTuQ&action=jobs-stats&q=sales&userip=2605:6000:ec89:b100:7930:247f:dc12:4d39&useragent=Chrome/61.0.3163.91";
	
	var queryURL1 = "http://api.glassdoor.com/api/api.htm?t.p=198273&t.k=cYTMMG3JTuQ&userip=&useragent=&format=json&v=1&action=jobs-prog&countryId=1&jobTitle=" + jobSelection; 
	var queryURL2 = "http://api.glassdoor.com/api/api.htm?t.p=198273&t.k=cYTMMG3JTuQ&userip=&useragent=&format=json&v=1&action=jobs-stats&l=" + location + "&jt=" + jobSelection + "&returnCities=true"; 

	// 2605:6000:ec89:b100:7930:247f:dc12:4d39
	// user agent // Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.91 Safari/537.36
	// userip=2605:6000:ec89:b100:7930:247f:dc12:4d39&useragent=Chrome/51.0.2704.103
	// t.p=198273&t.k=cYTMMG3JTuQ

	// append a row with #id === location

	var rowId = location + Date.now();
	var row = $("#table").append('<tr id=' + rowId + '><td>' + jobSelection + '</td><td>' + location + '</td><td class="td1">' + "Loading..." + '</td><td class="td2">' + "Loading...." + '</td></tr>');

	$.ajax({
      url: queryURL1,
      method: "GET"
    })
	.done(function(response) {
		var results = response.data;
		var salary = "$" + response.response.payLow + " - " + "$" + response.response.payHigh;
	
		// grab row with id === location
		// append into that row the data

		$('.td1', "#" + rowId).text(salary);

	});

	$.ajax({
      url: queryURL2,
      method: "GET"
    })
	.done(function(response) {
		var results = response.data;
		var opps = response.response.cities[0].numJobs;

		// grab row with id === location
		// append into that row the data

		$('.td2', "#" + rowId).text(opps);
		
	});
		
});

// Create function that takes in job selection and location inputs and runs them

// Create Ajax requests for Glassdoor, Indeed, Google Maps, etc

// Create variables that set themselves to JSON data from API pulls

// Display relevant information on table

// Display location input on Google Maps

// Allow users to save "favorited" results, which adds them to personal table

});
