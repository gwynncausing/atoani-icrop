//make this as global variable
let isPasswordValid = false;

//make these variables within this scopse

(() => {
	
	let defaults = {
		numCharacters: 8,
		useLowercase: true,
		useUppercase: true,
		useNumbers: true,
		useSpecial: false,
		infoMessage: '',
		style: "light", 
		fadeTime:300 
	};

	let settings = defaults;
	settings.infoMessage = 'In order to have a secure passsword, it must have the following characteristics: ';

	let numCharactersUI = '<li class="pr-numCharacters"><span></span>at least '+ settings.numCharacters + ' characters</li>'
	let	useLowercaseUI = ''
	let	useUppercaseUI = ''
	let	useNumbersUI   = ''
	let	useSpecialUI   = ''

	let numCharactersDone = false;
	let useLowercaseDone = false;
	let useUppercaseDone = false;
	let useNumbersDone   = false;
	//useSpecialDone   = false;

	// Show or Hide password hint based on user's event
	// Set variables
	let lowerCase   		= new RegExp('[a-z]');
	let upperCase   		= new RegExp('[A-Z]');
	let numbers     		= new RegExp('[0-9]');
	let specialCharacter     = new RegExp('[!,%,&,@,#,$,^,*,?,_,~]');

	// Check if the options are checked
	if (settings.useLowercase === true) 
		useLowercaseUI = '<li class="pr-useLowercase"><span></span>Lowercase letter</li>';
	if (settings.useUppercase === true) 
		useUppercaseUI = '<li class="pr-useUppercase"><span></span>Capital letter</li>';
	if (settings.useNumbers === true) 
		useNumbersUI = '<li class="pr-useNumbers"><span></span>Number</li>';
	if (settings.useSpecial === true) 
		useSpecialUI = '<li class="pr-useSpecial"><span></span>Special character</li>';

	// Append password hint div
	let passwordHints = `<div id="pr-box">
							<i></i>
							<div id="pr-box-inner">
								<p>${settings.infoMessage} </p>
								<ul>
									${numCharactersUI}
									${useLowercaseUI}
									${useUppercaseUI}
									${useNumbersUI}
									${useSpecialUI} 
								</ul>
							</div>
						</div>`;

	// Show Message reusable function 
	let showMessage = function () {
		if (numCharactersDone === false || useLowercaseDone === false || useUppercaseDone === false || useNumbersDone === false) {
			$(".pr-password").each(function() {
				// Find the position of element
				var posH = $(this).offset().top,
					itemH = $(this).innerHeight(),
					totalH = posH+itemH,
					itemL = $(this).offset().left;
				// Append info box tho the body
				
				$("body").append(passwordHints);
				$("#pr-box").addClass(settings.style)
								.fadeIn(settings.fadeTime)
								.css({top:totalH, left:itemL});
			});
			
		}
	};


	$(".pr-password input").on("focus",function (){
		showMessage();
	});

	// Delete Message reusable function 
	const deleteMessage = function () {
		const targetMessage = $("#pr-box");
		targetMessage.fadeOut(settings.fadeTime, function(){
			$(this).remove();
		});
	};

	// Show / Delete Message when completed requirements function 
	var checkCompleted = function () {

		if (numCharactersDone === true && useLowercaseDone === true && useUppercaseDone === true && useNumbersDone === true) {
			deleteMessage();
			$("#pr-password").removeClass("is-invalid");
			$("#pr-password").addClass("is-valid");
			//global variable
			isPasswordValid = true;
			
		} else {
			showMessage();
			$("#pr-password").removeClass("is-valid");
			$("#pr-password").addClass("is-invalid");
			//global variable
			isPasswordValid = false;
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

	// Show or Hide password hint based on keyup
	$("#pr-password").on("keyup focus", function (){
		let currentPassword = $(this).val();  

		//number of characters meet the requirements
		if ( currentPassword.length >= settings.numCharacters ) {
			$(".pr-numCharacters span").addClass("pr-ok");
			numCharactersDone = true;
		} else {
			$(".pr-numCharacters span").removeClass("pr-ok");
			numCharactersDone = false;
		}
		// lowerCase meet requirements
		if (settings.useLowercase === true) {
			if ( currentPassword.match(lowerCase) ) {
				$(".pr-useLowercase span").addClass("pr-ok");
				useLowercaseDone = true;
			} else {
				$(".pr-useLowercase span").removeClass("pr-ok");
				useLowercaseDone = false;
			}
		}
		// upperCase meet requirements
		if (settings.useUppercase === true) {
			if ( currentPassword.match(upperCase) ) {
				$(".pr-useUppercase span").addClass("pr-ok");
				useUppercaseDone = true;
			} else {
				$(".pr-useUppercase span").removeClass("pr-ok");
				useUppercaseDone = false;
			}
		}
		// upperCase meet requirements
		if (settings.useNumbers === true) {
			if ( currentPassword.match(numbers) ) {
				$(".pr-useNumbers span").addClass("pr-ok");
				useNumbersDone = true;
			} else {
				$(".pr-useNumbers span").removeClass("pr-ok");
				useNumbersDone = false;
			}
		}
		// upperCase meet requirements
		if (settings.useSpecial === true) {
			if ( currentPassword.match(specialCharacter) ) {
				$(".pr-useSpecial span").addClass("pr-ok");
				useSpecialDone = true;
			} else {
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

})()