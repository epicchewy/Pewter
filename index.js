var signup_username = "";
var signup_school;
var signup_password;
var signup_email;
var signup_first;
var signup_last;
var user_id;
var loadedSchedule = false;

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

function takePhoto(){
	//use phone camera to get prof pic
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
	loadNewsFeed();
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
    	loadNewsFeed();
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

function pushQuestion(){
	var current = Parse.User.current();

	var Post = Parse.Object.extend("Post");
	var post = new Post();
	var class_ = $("#question_subject").val();
	var question = $("textarea#question_text").val();
	var answers = [];
	post.set("class_", class_);
	post.set("question", question);
	post.set("school", signup_school);
	post.set("user", current);
	post.set("answers", answers);
	post.save(null, {
		success:function(post){
			alert("You have asked your question");
		},
		error:function(error){
			alert("oh shit homie");
		}
	});
	$.mobile.changePage("#feed");
	$("#question_subject").val() = "";
	$("textarea#question_text").val() = "";
}

function loadNewsFeed(){
	var Post = Parse.Object.extend("Post");
	var query = new Parse.Query(Post);
	query.equalTo("school", signup_school);
	query.find({
		success: function(data){
			console.log(data);
			for(var i = 0; i < data.length; i++){
				console.log(data[0].attributes.class_);
				console.log(data[0].attributes.question);
				var post_ID = data[i].id;
				var question = data[i].attributes.question;
				var index = i;
				$("#feedlist").append("<li data-role = 'collapsible'><h1>"+data[i].attributes.class_ +"</h1><ul data-role='listview' id = 'feedlist2'><li>"+ data[i].attributes.question+"</li></ul><div data-role='fieldcontain'><label for='textarea'>Answer:</label><textarea cols='40' rows='8' name='textarea' id='post_answer"+i+"'></textarea></div> <button id = 'push_answer_"+i+"'>Answer</button></li>");

				$("#push_answer_" + index).on('click', function() {
					var answer = $("textarea#post_answer" + index).val();
       				pushAnswer(post_ID, index, question,answer);
   				});

			}
			$("#feedlist2").listview('refresh');
			$("#feedlist").listview('refresh');
			
		}
	});
}

function pushAnswer(ID, val, question,answer){
	var Post = Parse.Object.extend("Post");
	var query = new Parse.Query(Post);
	query.equalTo("question", question);
	query.find({
		success:function(result){
			result[0].add("answers",answer);
			result[0].save({
				success:function(data){
					
				},
				error:function(error){
				}
			});
		},
		error:function(error){
		}
	});
	alert("answer pushed");
}

function loadActivityFeed(){

}

function loadNotifications(){

}

function loadSchoolProfile(){

}

//collaborate

function loadChatBySchedule(){
	if(!loadedSchedule){
		var Schedule = Parse.Object.extend("Schedule");
		var current_user = Parse.User.current();
		var query = new Parse.Query(Schedule);
		query.equalTo("user", current_user);
		query.find({
		success:function(result){
			alert("SUCCESS");
			var class_str = result[0].attributes.class;

			var classes = [];
			var index = 0;
			var index2;
			for(var i = 0 ; i < class_str.length; i++){
				if(class_str.substring(i, i+1) == "|"){
					index2 = i;
					console.log(class_str.substring(index,index2));
					classes.push(class_str.substring(index, index2));
					console.log(classes);
					index = index2 + 1;
					console.log(index + "  " + index2);
				}
			}
			for(var k = 0; k < classes.length; k++){
				$("#chats").append("<li><a href='#' onclick = 'startChat()' style='margin-right:15%;margin-left:15%;'>"+ classes[k] +"</a></li><br>")
			}
			$("#chats").listview('refresh');
		},
		error:function(error){
			console.log(error);
		}
		
	});
		loadedSchedule = true;
	}else{

	}
}

function startChat(){
	var options = {
		email:  "chui.luke99@outlook.com",
	    iframe: false,
	    tagid4iframe: "#chatFrame",
	    iframewidth: "920px",
	    iframeheight: "650px",
	    autostart_meet: false,
	    autostart_note: false,
	    start_chat: function(event) {
	    	console.log(event.session_id);
	        alert("Chat started session Id: " + event.session_id);
	    },
	    start_meet: function(event) {
	        alert("Meet started session key: " + event.session_key + " session id: " + event.session_id);
	    },
	    end_meet: function(event) {
	        alert("Meet end event");
	    },
	    invite_member: function(event) {
	        alert("Invite member into binder Id: " + event.binder_id);
	    },
	    request_note: function(event) {
	        alert("Note start request");
	    },
	    error: function(event) {
	        alert("Chat error code: " + event.error_code + " error message: " + event.error_message);
	    }
	};
	Moxtra.chat(options);
}

//Company: Pewter
