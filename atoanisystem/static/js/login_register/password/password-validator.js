/*
	To use this password Helper
	password = input password 
	password_confirm = input password confirm
	passwordHelper.init(password, password_confirm)
	jquery style in getting the dom elements

	example: 
		passwordHelper.init($("#password"), $("#password_confirm"));
		
		- to check the validity of password
		- this function returns true or false
		passwordHelper.passwordValidity
		passwordHelper.passwordConfirmValidity

	
	<div class="pr-password">
		<input type="password">
		.......
	</div>
	.pr-password
	sa container sa password mismo kay naa na class kay maoy basehan sa position sa created na nofication for validator tag

	make sure sad na
		sa scss file, 
		included ang _password-hint.scss
		para naay design ang created na nofication for validator tag

	passwordHelper.init($("#pr-password"), $("#password-confirm"));

	if(passwordHelper.passwordValidity == false){
        ......
    }
    if(passwordHelper.passwordConfirmValidity == false){
        ......
	}
	
	pd sad nimo macheck ang naa sa validate-registration.js
*/

const passwordHelper = {
	passwordValidity: false,
	passwordConfirmValidity: false,
	settings: {
		numCharacters: 8,
		useLowercase: true,
		useUppercase: true,
		useNumbers: true,
		useSpecial: false,
		infoMessage: 'In order to have a secure passsword, it must have the following characteristics: ',
		style: "light", 
		fadeTime:300, 
	},
	required: {
		numCharactersDone : false,
		useLowercaseDone : false,
		useUppercaseDone : false,
		useNumbersDone : false,
		useSpecialDone : false,
	},
	regex: {
		lowerCase : new RegExp('[a-z]'),
		upperCase : new RegExp('[A-Z]'),
		numbers : new RegExp('[0-9]'),
		specialCharacter : new RegExp('[!,%,&,@,#,$,^,*,?,_,~]'),
	},
	cacheDom: function(password, password_confirm) {
		this.$body = $('body');
		this.$pr_password = $(".pr-password");
		this.$password = password;
		this.$password_confirm = password_confirm;
	},
	bindEvents: function() {
		this.$password.on("focus", this.showMessage.bind(this));
		this.$password.on("blur", this.hintOnBlur.bind(this));
		this.$password.on("keyup", this.check.bind(this));
		this.$password_confirm.on("keyup", this.checkPasswordIfSame.bind(this));
	},
	init: function (password, password_confirm){
		this.cacheDom(password, password_confirm);
		this.bindEvents();
	},
	showMessage: function() {
		if(this.required.numCharactersDone === false || this.required.useLowercaseDone === false || this.required.useUppercaseDone === false || this.required.useNumbersDone === false) {
			this.$pr_password.each(this.createHint.bind(this));
		}
	},
	createHint: function() {
		let pos_h = this.$pr_password.offset().top,
			item_h = this.$pr_password.innerHeight(),
			total_h = pos_h + item_h,
			item_l = this.$pr_password.offset().left;
		this.$body.append(this.templateHints());
		$("#pr-box").addClass(this.settings.style)
						.fadeIn(this.settings.fadeTime)
						.css({top:total_h, left:item_l});

	},
	deleteMessage: function() {
		const targetMessage = $("#pr-box");
		targetMessage.fadeOut(this.settings.fadeTime, function() { targetMessage.remove() });
	},
	checkCompletedRequirements: function () {
		if (this.required.numCharactersDone === true && this.required.useLowercaseDone === true && this.required.useUppercaseDone === true && this.required.useNumbersDone === true) {
			this.deleteMessage();
			this.addValidClass(this.$password)
			this.passwordValidity = true;
			
		} else {
			this.showMessage();
			this.addInvalidClass(this.$password);
			this.passwordValidity = false;
		}
	},
	hintOnBlur: function() {
		this.deleteMessage();
		if(this.passwordValidity == false)
			this.addInvalidClass(this.$password);
		else
			this.addValidClass(this.$password);
	},
	templateHints: function() {
		let numCharactersUI = '<li class="pr-numCharacters"><span></span>at least '+ this.settings.numCharacters + ' characters</li>';
		let	useLowercaseUI = '';
		let	useUppercaseUI = '';
		let	useNumbersUI   = '';
		let	useSpecialUI   = '';
		// Check if the options are checked
		if(this.settings.useLowercase === true) 
			useLowercaseUI = '<li class="pr-useLowercase"><span></span>Lowercase letter</li>';
		if(this.settings.useUppercase === true) 
			useUppercaseUI = '<li class="pr-useUppercase"><span></span>Capital letter</li>';
		if(this.settings.useNumbers === true) 
			useNumbersUI = '<li class="pr-useNumbers"><span></span>Number</li>';
		if(this.settings.useSpecial === true) 
			useSpecialUI = '<li class="pr-useSpecial"><span></span>Special character</li>';
		return  `<div id="pr-box">
						<i></i>
						<div id="pr-box-inner">
							<p>${this.settings.infoMessage} </p>
							<ul>
								${numCharactersUI}
								${useLowercaseUI}
								${useUppercaseUI}
								${useNumbersUI}
								${useSpecialUI} 
							</ul>
						</div>
					</div>`;
	},
	check: function() {
		let currentPassword =this.$password.val();  
		if (currentPassword.length >= this.settings.numCharacters ) {
			$(".pr-numCharacters span").addClass("pr-ok");
			this.required.numCharactersDone = true;
		} else {
			$(".pr-numCharacters span").removeClass("pr-ok");
			this.required.numCharactersDone = false;
		}
		// lowerCase meet requirements
		if (this.settings.useLowercase === true) {
			if ( currentPassword.match(this.regex.lowerCase) ) {
				$(".pr-useLowercase span").addClass("pr-ok");
				this.required.useLowercaseDone = true;
			} else {
				$(".pr-useLowercase span").removeClass("pr-ok");
				this.required.useLowercaseDone = false;
			}
		}
		// upperCase meet requirements
		if (this.settings.useUppercase === true) {
			if ( currentPassword.match(this.regex.upperCase) ) {
				$(".pr-useUppercase span").addClass("pr-ok");
				this.required.useUppercaseDone = true;
			} else {
				$(".pr-useUppercase span").removeClass("pr-ok");
				this.required.useUppercaseDone = false;
			}
		}
		// upperCase meet requirements
		if (this.settings.useNumbers === true) {
			if ( currentPassword.match(this.regex.numbers) ) {
				$(".pr-useNumbers span").addClass("pr-ok");
				this.required.useNumbersDone = true;
			} else {
				$(".pr-useNumbers span").removeClass("pr-ok");
				this.required.useNumbersDone = false;
			}
		}
		// upperCase meet requirements
		if (this.settings.useSpecial === true) {
			if ( currentPassword.match(this.regex.specialCharacter) ) {
				$(".pr-useSpecial span").addClass("pr-ok");
				this.required.useSpecialDone = true;
			} else {
				$(".pr-useSpecial span").removeClass("pr-ok");
				this.required.useSpecialDone = false;
			}
		}

		this.checkCompletedRequirements();

		if((currentPassword !== this.$password_confirm.val()) && this.$password_confirm.val().trim()  !== ""){
			this.passwordConfirmValidity = false;
			this.addInvalidClass(this.$password_confirm)
		}
		if(this.passwordValidity === true){
			if(this.$password_confirm.val().trim()  !== "" && this.$password_confirm.val() === currentPassword){
				this.passwordConfirmValidity = true;
				this.addValidClass(this.$password_confirm)		
			}
			else{
				this.passwordConfirmValidity = false;
				this.addInvalidClass(this.$password_confirm);	
			}
		}
	},
	checkPasswordIfSame: function() {
		if(this.isPasswordsSame(this.$password.val(), this.$password_confirm.val())){
			this.passwordConfirmValidity = true;
			this.addValidClass(this.$password_confirm);
		}
        else{
			this.passwordConfirmValidity = false;
			this.addInvalidClass(this.$password_confirm);
		}
		if(this.passwordValidity == false){
			this.passwordConfirmValidity = false;
			this.addInvalidClass(this.$password_confirm);		
		}
	},
	isPasswordsSame: function (p1, p2) {
		return p1 === p2;
	},
	addInvalidClass: function(field) {
        field.removeClass('is-valid');
        field.addClass('is-invalid');
	},
	addValidClass: function(field) {
        field.removeClass('is-invalid');
        field.addClass('is-valid');
	},
	removeValidClass: function(field) {
		field.removeClass('is-valid');
	},
	removeInvalidClass: function(field){
		field.removeClass('is-invalid');
	},
	reset: function() {
		this.removeValidClass(this.$password);
		this.removeInvalidClass(this.$password);
		this.removeValidClass(this.$password_confirm);
		this.removeInvalidClass(this.$password_confirm);
		this.required.numCharactersDone = false;
		this.required.useLowercaseDone = false;
		this.required.useUppercaseDone = false;
		this.required.useNumbersDone = false;
		this.required.useSpecialDone = false;
		this.passwordValidity = false;
		this.passwordConfirmValidity = false;
		$(".pr-numCharacters span").removeClass("pr-ok");
		$(".pr-useLowercase span").removeClass("pr-ok");
		$(".pr-useUppercase span").removeClass("pr-ok");
		$(".pr-useSpecial span").addClass("pr-ok");
		$(".pr-useNumbers span").removeClass("pr-ok");
	}
}
