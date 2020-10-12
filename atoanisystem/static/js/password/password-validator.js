//make this as global variable
let isPasswordValid = false;

//make these variables within this scopse
(() => {
	
	var defaults = {
		numCharacters: 8,
		useLowercase: true,
		useUppercase: true,
		useNumbers: true,
		useSpecial: false,
		infoMessage: '',
		style: "light", 
		fadeTime:300 
	};

	var o = defaults;


	o.infoMessage = 'In order to have a secure passsword, it must have the following characteristics: ';

	var numCharactersUI = '<li class="pr-numCharacters"><span></span>at least '+ o.numCharacters + ' characters</li>',
		useLowercaseUI = '',
		useUppercaseUI = '',
		useNumbersUI   = '',
		useSpecialUI   = '';

	// Check if the options are checked
	if (o.useLowercase === true) {
		useLowercaseUI = '<li class="pr-useLowercase"><span></span>Lowercase letter</li>';
	}
	if (o.useUppercase === true) {
		useUppercaseUI = '<li class="pr-useUppercase"><span></span>Capital letter</li>';
	}
	if (o.useNumbers === true) {
		useNumbersUI = '<li class="pr-useNumbers"><span></span>Number</li>';
	}
	if (o.useSpecial === true) {
		useSpecialUI = '<li class="pr-useSpecial"><span></span>Special character</li>';
	}

	// Append password hint div
	var messageDiv = '<div id="pr-box"><i></i><div id="pr-box-inner"><p>' + o.infoMessage + '</p><ul>' + numCharactersUI + useLowercaseUI + useUppercaseUI + useNumbersUI + useSpecialUI + '</ul></div></div>';

	// Set campletion vatiables
	//var numCharactersDone = true,
	//	useLowercaseDone = true,
	//	useUppercaseDone = true,
	//	useNumbersDone   = true,
	//	useSpecialDone   = true;

	var numCharactersDone = false,
		useLowercaseDone = false,
		useUppercaseDone = false,
		useNumbersDone   = false,
		useSpecialDone   = false;

	// Show Message reusable function 
	var showMessage = function () {
		if (numCharactersDone === false || useLowercaseDone === false || useUppercaseDone === false || useNumbersDone === false) {
			$(".pr-password").each(function() {
				// Find the position of element
				var posH = $(this).offset().top,
					itemH = $(this).innerHeight(),
					totalH = posH+itemH,
					itemL = $(this).offset().left;
				// Append info box tho the body
				
				$("body").append(messageDiv);
				$("#pr-box").addClass(o.style)
								.fadeIn(o.fadeTime)
								.css({top:totalH, left:itemL});
				
					console.log("HEEEELLLOOOO");
			});
			
		}
	};


	$(".pr-password input").on("focus",function (){
		showMessage();
		console.log("I am the last")
	});

	// Delete Message reusable function 
	var deleteMessage = function () {
		var targetMessage = $("#pr-box");
		targetMessage.fadeOut(o.fadeTime, function(){
			$(this).remove();
		});
	};

	// Show / Delete Message when completed requirements function 
	var checkCompleted = function () {

		console.log(numCharactersDone)
		console.log(useLowercaseDone)
		console.log(useUppercaseDone)
		console.log(useNumbersDone)

		if (numCharactersDone === true && useLowercaseDone === true && useUppercaseDone === true && useNumbersDone === true) {
			deleteMessage();

			$("#pr-password").removeClass("is-invalid");
			$("#pr-password").addClass("is-valid");
			isPasswordValid = true;

			
			console.log("Valid Password")
			
		} else {
			showMessage();
			$("#pr-password").removeClass("is-valid");
			$("#pr-password").addClass("is-invalid");
			isPasswordValid = false;

			console.log("Checked Completed Here")
		}
	};

	// Show password hint 
	$('.pr-password input').on("blur",function (){
		deleteMessage();

		if(isPasswordValid == false){
			$("#pr-password").removeClass("is-valid");
			$("#pr-password").addClass("is-invalid");
		}
		else{
			$("#pr-password").removeClass("is-invalid");
			$("#pr-password").addClass("is-valid");
		}
	});


	// Show or Hide password hint based on user's event
	// Set variables
	var lowerCase   		= new RegExp('[a-z]'),
	upperCase   		= new RegExp('[A-Z]'),
	numbers     		= new RegExp('[0-9]'),
	specialCharacter     = new RegExp('[!,%,&,@,#,$,^,*,?,_,~]');

	// Show or Hide password hint based on keyup
	$("#pr-password").on("keyup focus", function (){
		var thisVal = $(this).val();  

		//console.log("Change")
		



		// Check # of characters
		if ( thisVal.length >= o.numCharacters ) {
			// console.log("good numCharacters");
			$(".pr-numCharacters span").addClass("pr-ok");
			numCharactersDone = true;
		} else {
			// console.log("bad numCharacters");
			$(".pr-numCharacters span").removeClass("pr-ok");
			numCharactersDone = false;
		}
		// lowerCase meet requirements
		if (o.useLowercase === true) {
			if ( thisVal.match(lowerCase) ) {
				// console.log("good lowerCase");
				$(".pr-useLowercase span").addClass("pr-ok");
				useLowercaseDone = true;
			} else {
				// console.log("bad lowerCase");
				$(".pr-useLowercase span").removeClass("pr-ok");
				useLowercaseDone = false;
			}
		}
		// upperCase meet requirements
		if (o.useUppercase === true) {
			if ( thisVal.match(upperCase) ) {
				// console.log("good upperCase");
				$(".pr-useUppercase span").addClass("pr-ok");
				useUppercaseDone = true;
			} else {
				// console.log("bad upperCase");
				$(".pr-useUppercase span").removeClass("pr-ok");
				useUppercaseDone = false;
			}
		}
		// upperCase meet requirements
		if (o.useNumbers === true) {
			if ( thisVal.match(numbers) ) {
				// console.log("good numbers");
				$(".pr-useNumbers span").addClass("pr-ok");
				useNumbersDone = true;
			} else {
				// console.log("bad numbers");
				$(".pr-useNumbers span").removeClass("pr-ok");
				useNumbersDone = false;
			}
		}
		// upperCase meet requirements
		if (o.useSpecial === true) {
			if ( thisVal.match(specialCharacter) ) {
				// console.log("good specialCharacter");
				$(".pr-useSpecial span").addClass("pr-ok");
				useSpecialDone = true;
			} else {
				// console.log("bad specialCharacter");
				$(".pr-useSpecial span").removeClass("pr-ok");
				useSpecialDone = false;
			}
		}

		checkCompleted();

		if(($(this).val() !== passwordConfirm.value) && passwordConfirm.value.trim()  !== ""){
			passwordConfirm.classList.remove("is-valid");
			passwordConfirm.classList.add("is-invalid");
		}
		if(isPasswordValid === true){
			if(passwordConfirm.value.trim()  !== "" && passwordConfirm.value === $(this).val()){
				passwordConfirm.classList.remove("is-invalid");
				passwordConfirm.classList.add("is-valid");			
			}
			else{
				passwordConfirm.classList.remove("is-valid");
				passwordConfirm.classList.add("is-invalid");		
			}
		}
	});

	const displayPasswordValidity = () => {
		if(isPasswordValid == false){
			$("#pr-password").removeClass("is-valid");
			$("#pr-password").addClass("is-invalid");
		}
		else{
			$("#pr-password").removeClass("is-invalid");
			$("#pr-password").addClass("is-valid");
		}	
	}

})()