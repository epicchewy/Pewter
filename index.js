var signup_username = "";
var signup_school;
var signup_password;
var signup_email;
var signup_first;
var signup_last;
var user_id;

var profile_setup = false;
var class_added = false;
var schedule = [];

$(function(){
	$("#searchingPicture").hide();
	$("#dropdown_div").hide();
	console.log("ready");
	Parse.initialize("LgTg5AVdGDTKIZMxHfH4pcV4T2oqJ2zExTtRhrXH", "mc1hMF35qXQKJ52mRX4yDOleJObeUjAWPD3ha1qd");    
});

function setUpProfile(){
	$("#profileList").append("<li style='margin-right:25%;margin-left:25%;'><center>Name: "+ signup_first + "  "+ signup_last +"</center></li>");
	$("#profileList").append("<li style='margin-right:25%;margin-left:25%;'><center>Email: "+ signup_school+"</li>");
	$("#profileList").listview('refresh');
}

function addClass(){
	var class_ = $("#class_select option:selected").html();
	schedule.push(class_+"|");
	$("#schedule_list").append('<li style="margin-right:25%;margin-left:25%;"><center>'+class_+'</center></li>');
	$("#schedule_list").listview('refresh');
}

function finishSchedule(){
	var user = Parse.User.current();
	var Schedule = Parse.Object.extend("Schedule");
	var schedule_ = new Schedule();
	schedule_.set("class", schedule[0]);
	schedule_.set("user",user);
	for(var i = 1; i < schedule.length; i++){
		schedule_.add("class", schedule[1]);
	}
	schedule_.save(null, {
		success:function(schedule){
			alert("schedule created");
			$("#schedule").hide();
		},
		error:function(schedule, erro){
			alert(error);
		}
	});

}

function takePhoto(){
	//use phone camera to get prof pic
}

function openPanel(){
	$( "#feedpanel" ).panel( "open");
}

//Sign UP

function checkSignUp(){
	var pass = $("#password").val();
	var name = $("#name").val();
	console.log(pass + "    name: " + name);
	if((name === null) || (pass === null)){
		alert("Sorry, reenter your username and password");
	}
	else{
		var login_user = Parse.User.logIn(name, pass, {
  		success: function(user) {
  			alert("Welcome", name);
    		$.mobile.changePage("#feed");
  		},
		  error: function(user, error) {
		    alert("Sorry: ", error.message);
		  }
		});
	}
	var currentUser = Parse.User.current();
	if (currentUser) {
		signup_first = currentUser.attributes.first_name;
		signup_last = currentUser.attributes.last_name;
		signup_school = currentUser.attributes.school;
	} else {
   		console.log("dps");
	}
}

function newUser(){
	var user = new Parse.User();

	var signup_first = $("#signup_first").val();
	var signup_last = $("#signup_last").val();
	var signup_username = $("#signup_name").val();
	console.log(signup_username);
	var signup_password = $("#signup_password").val();
	var signup_email = $("#signup_email").val();
	var signup_school = $("#dropdown option:selected").html();

	if(signup_name === null || signup_school === null || signup_email === null || signup_password === null){
		alert("Some fields were not inputted correctly");
	}

	user.set("first_name", signup_first);
	user.set("last_name", signup_last);
	user.set("username", signup_username);
	user.set("password", signup_password);
	user.set("email", signup_email);
	user.set("school", signup_school);
	user.set("class_added", class_added);
	user.set("profile_setup", profile_setup);
	
	user.signUp(null, {
	  success: function(user) {
	  	alert("Welcome to Pewter");
    	$.mobile.changePage("#feed");
	    console.log("NICCEEE");// Hooray! Let them use the app now.
	  },
	  error: function(user, error) {
	    // Show the error message somewhere and let the user try again.
	    alert("Error: " + error.code + " " + error.message);
	  }
	});
}

//High School Search

var name = "";

function getSchool(){
	console.log("School...");
	name = $("#signup_school").val();
}

function getData(){
	getSchool();
	var schoolList = [];
	console.log(name);
	console.log("searching");
	var data = {
    	resource_id: '102fd9bd-4737-401b-b88f-5c5b0fab94ec', // the resource id
    	limit: 15, // get 5 results
    	q: name // query for 'jones'
 	}; 	
 	$.ajax({
 		beforeSend: function(){
 			$("#searchingPicture").show();
 		},
	    url: 'https://inventory.data.gov/api/action/datastore_search',
	    data: data,
	    dataType: 'jsonp',
	    success: function(data) {
	    	console.log(data);
	    	$("#searchingPicture").hide();
	    	$("#dropdown_div").show();
	    	schoolList = data.result.records;
	    	//console.log(schoolList[1]["SCHNAM09"]);
	    	for(var i = 0; i < schoolList.length; i++){
	    		$("#dropdown").append('<option value="'+i+'">'+schoolList[i]["SCHNAM09"]+'</option>');
	    	}
	    },
	    error: function(error){
	    	$("#searchingPicture").hide();
	    	alert("Couldn't find school");
	    }
  	});
}

//newfeed calls

function loadNewsFeed(){
	var query = new Parse.Query(Parse.User);
	query.equalTo("school", signup_school);
	query.find({
		success: function(data){
			console.log(data);
			
		}
	});
}

//Company:

// Pewter

// Application Name:

// Pewter

// API Key:

// 75wkul18hlrqm1

// Secret Key:

// 2tCQoiB8OAnCZHBz

// OAuth User Token:

// 958b1a1e-a845-4143-924b-8d1d89564a2f

// OAuth User Secret:

// 64b0473a-4b5a-4fda-9a72-626475ecdaf2