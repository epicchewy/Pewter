$(function(){
	console.log("ready");
	// Parse.initialize("LgTg5AVdGDTKIZMxHfH4pcV4T2oqJ2zExTtRhrXH", "mc1hMF35qXQKJ52mRX4yDOleJObeUjAWPD3ha1qd");
 //    var TestObject = Parse.Object.extend("TestObject");
 //    var testObject = new TestObject();
 //      testObject.save({foo: "bar"}, {
 //      success: function(object) {
 //        alert('successs');
 //      },
 //      error: function(model, error) {
 //        alert(error);
 //      }
 //    });
    
});

function setUpProfile(){

}

function openPanel(){
	$( "#feedpanel" ).panel( "open");
}

function checkSignUp(){
	var pass = $("#password").val();
	var name = $("#name").val();
	if((name === null) || (pass === null)){
		alert("Sorry, reenter your username and password");
	}
	else{
		Parse.User.logIn(name, pass, {
  		success: function(user) {
  			alert("Welcome", name);
    		$.mobile.changePage("#feed");
  		},
		  error: function(user, error) {
		    alert("Sorry: ", error.message);
		  }
		});
	}
}

function newUser(){
	var user = new Parse.User();
	user.set("username", "my name");
	user.set("password", "my pass");
	user.set("email", "email@example.com");
	  
	// other fields can be set just like with Parse.Object
	user.set("phone", "650-555-0000");
	  
	user.signUp(null, {
	  success: function(user) {
	  	alert("Welcome to Pewter");
	    console.log("NICCEEE");// Hooray! Let them use the app now.
	  },
	  error: function(user, error) {
	    // Show the error message somewhere and let the user try again.
	    alert("Error: " + error.code + " " + error.message);
	  }
	});
}


//inith heroku comit


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