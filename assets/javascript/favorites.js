$( document ).ready(function() {

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

	database.ref().on("child_added", function(snapshot) {
		var sv = snapshot.val();
		var entry = '<tr><td>' + sv.job + '</td><td>' + sv.location + '</td><td>' + sv.salary + '</td><td>' + sv.opportunities + '</td><td>' + '<a class="btn-floating btn-large waves-effect waves-light red"><i class="material-icons">add</i></a></td></tr';
		$("#table2").append(entry);

	});

});
