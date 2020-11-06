function checkFromServer(inputElement,inputName){
    inputElement.classList.remove('is-valid');
    inputElement.classList.remove('is-invalid');
    const form = document.querySelector(".registration-form");
    doesInputExist(form,inputElement,inputName);
}

function doesInputExist(form,inputElement,inputName){
    let formData = new FormData(form);
    formData.append('input',inputName);
    $.ajax({
        url: '',
        type: 'post',
        data: formData,
        contentType: false,
        processData: false,
        success: function(response){
            inputElement.classList.add('is-valid');
        },
        error: function(response){
            inputElement.classList.add('is-invalid');
        }
    });
}

function check(input){
    const form = document.querySelector(".registration-form")
    let formData = new FormData(form);
    $.ajax({
        url: '',
        type: 'post',
        data: formData,
        contentType: false,
        processData: false,
        success: function(response){
            input.classList.add('is-valid');
        },
        error: function(response){
            input.classList.add('is-invalid');
        }
    });
}

//make these variables within this scopse
( validate = () => {
    
    const forms = document.querySelector(".registration-form")
    const textFields = forms.querySelectorAll("form input[required]")
    const password = forms.querySelector("#pr-password");
    const passwordConfirm = document.querySelector("#password-confirm");
    const passwordEye = forms.querySelector(".view-password");
    const passwordConfirmEye = forms.querySelector(".view-password-confirm");
    const email = document.getElementById('email');
    const contact = document.getElementById('contact-number');
    const contactInfo = document.querySelector("#contact-info");
    const username = document.getElementById('username');
    const landarea = document.getElementById('landarea');
    const farmerRadio = document.getElementById('farmer');
    const customerRadio = document.getElementById('customer');
    const provinceSelector = document.getElementById("province");
    const termsAndConditions = document.getElementById("termsAndConditions");
    const termsAndConditionsErrorHolder = document.getElementById("terms-and-conditions-invalid");
    const firstQuestionAnswers = document.querySelector("[name=first_question_answers]");
    const secondQuestionAnswers = document.querySelector("[name=second_question_answers]");
    const securityQuestion1 = document.querySelector("[name=security-question-1]");
    const securityQuestion2 = document.querySelector("[name=security-question-2]");
    const securityAnswer1 = document.querySelector("[name=answer-1]");
    const securityAnswer2 = document.querySelector("[name=answer-2]");
    const reminder = document.querySelector("#reminder");

    //ERROR MESSAGES:
    const usernameBlank  = "Please enter a username. It must not contain a space.";
    const usernameExists = "The username is already in use";
    const contactInvalidFormat = "Phone number must be in this format: 09xxxxxxxxx";
    const contactExists = "The contact number is already in use";
    const emailInvalidFormat = "Please enter your email address in format: yourname@example.com";
    const emailExists = "The email address is already in use";
    const termsAndConditionsUnchecked = "Please mark check if you have read and agree the Terms and Conditions.";

    let isEmailValid = false;
    let isContactValid = false;

    //password validator helper
    passwordHelper.init($("#pr-password"), $("#password-confirm"));

    //Calls necessary validation functions
    forms.addEventListener("submit", e => {
        let isValid = true;
        
        //check if email or phone number is answered
        let flag = 0;
        if(email.checkValidity() == false){
            isValid = false;
            flag++;
        }
        if(contact.checkValidity() == false){
            isValid = false;
            flag++;
        }
        if(flag == 0){
            if(email.value.trim() == "" && contact.value.trim() == ""){
                isValid = false;
            }
            else{
                contactInfo.value = "contact-info";
                displayValidity(contactInfo);
            }
        }

        //check the validity of each fields
        textFields.forEach(field => {
            if(field.id != 'username'){
                if(displayValidity(field) == false){
                    isValid = false;
                }
            }
            else{
                if(field.classList.contains("is-invalid") == true || field.value.trim() == ""){
                    addInvalidClass(field);
                    isValid = false;
                }
            }
        });

        //check the validity of the province
        if(provinceSelector.options[provinceSelector.selectedIndex].value === "-1"){
            addInvalidClass(provinceSelector);
            isValid = false;
        }
        // start - check the credibility of password
        //check the validity of password
        if(passwordHelper.passwordValidity == false){
            addInvalidClass(password);
            isValid = false;
        }
        //check the validity of confirm password
        if(passwordHelper.passwordConfirmValidity == false){
            addInvalidClass(passwordConfirm);
            isValid = false;
        }
        // end - check the credibility of password
        if(isValid == false){
            stopDefaultFormAction(e);
            reminder.classList.remove("d-none");
        }
        else if(isValid == true && termsAndConditions.checked == false){
            stopDefaultFormAction(e);
            termsAndConditionsErrorHolder.classList.remove("d-none");
            termsAndConditionsErrorHolder.innerHTML = termsAndConditionsUnchecked;   
            reminder.classList.add("d-none"); 
        }
        else{
            //if all input data needed is valid
            //populate the hidden fields with correct format for storing it on the db
            firstQuestionAnswers.value = `${securityQuestion1.options[securityQuestion1.selectedIndex].value} : ${securityAnswer1.value}`;
            secondQuestionAnswers.value = `${securityQuestion2.options[securityQuestion2.selectedIndex].value} : ${securityAnswer2.value}`;
        }
    })

    /////////////////////////////////////////////
    //--- Start of Event Listener Functions ---//
    /////////////////////////////////////////////
    //famer radio button is shown, make the landarea show
    farmerRadio.addEventListener('click',e => {landarea.setAttribute("type", "number");});
    customerRadio.addEventListener('click',e => {landarea.setAttribute("type", "hidden");});

    //required field event input listeners
    textFields.forEach(field => {
        field.addEventListener("input", e => {
           if(e.target.id !== "pr-password" && e.target.id != "password-confirm" && e.target.name !== "contact_number")
                displayValidity(e.target)
        })
    })

    //if province selector is selected
    //make barangay and city selector enabled
    provinceSelector.addEventListener("change", e => {
        addValidClass(provinceSelector);
        $("#barangay").prop("disabled", false);
        $("#city").prop("disabled", false);
    })

    //email input listener
    email.addEventListener("input", (e) => {  
        //if input length is 0
        //make it neutral
        if(e.target.value.toString().length === 0){
            removeValidClass(email);
            removeInvalidClass(email)
            isEmailValid = false;
        }
        else{
            document.getElementById("email-invalid").innerHTML = emailInvalidFormat;
            isEmailValid = displayValidity(e.target);
            if(isEmailValid){
                document.getElementById("email-invalid").innerHTML = emailExists;
                checkFromServer(email,'email');
            }
        }
    })

    //contact input listener
    //checks availability of contact
    contact.addEventListener('input', e => {
        //e.target.value = e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
        e.target.value = e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');

        //if input length is 0
        //make it neutral
        if(e.target.value.toString().length === 0){
            removeValidClass(contact);
            removeInvalidClass(contact)
            isContactValid = false;
        }
        else{
            document.getElementById("contact-invalid").innerHTML = contactInvalidFormat;
            isContactValid = displayValidity(e.target);
            //check if contact exists or not
            if(isContactValid === true){
                document.getElementById("contact-invalid").innerHTML = contactExists;
                checkFromServer(contact,'contact_number');
            }
        }
    })

    contact.addEventListener('keydown', function(event) {
        const key = event.key; // const {key} = event; ES6+
        if (key == "Backspace") {
            document.getElementById("contact-invalid").innerHTML = contactInvalidFormat; 
            removeValidClass(contact);
            removeInvalidClass(contact)
        }
    });

    username.addEventListener('input',(e) => {
        //if value is space, make it not show on the input
        e.target.value = e.target.value.replace(/[ ]/g, '').replace(/(\..*)\./g, '$1');
        if(e.target.value.toString().length === 0){
            document.getElementById("username-invalid").innerHTML = usernameBlank;
            displayValidity(username);
        }
        else{
            document.getElementById("username-invalid").innerHTML = usernameExists;
            checkFromServer(username,'username');
        }
    });

    passwordEye.addEventListener('click', (e) => makePasswordShow(e.target, "#pr-password"));
    passwordConfirmEye.addEventListener('click', (e) => makePasswordShow(e.target, "#password-confirm"));
    /////////////////////////////////////////////
    //--- End of Event Listener Functions ---//
    /////////////////////////////////////////////


    /////////////////////////////////////////////
    //------- Start of Helper Functions -------//
    /////////////////////////////////////////////
    //show or not the input password into text
    const makePasswordShow = (field, id) => {
        if(field.classList.contains('fa-eye')){
            field.classList.add('fa-eye-slash');
            field.classList.remove('fa-eye');
            $(id).prop('type', 'text');
        }
        else{
            field.classList.add('fa-eye');
            field.classList.remove('fa-eye-slash');
            $(id).prop('type', 'password');
        }
    }
    //displays the validation message/response
    const displayValidity = (field) => {
        if(field.checkValidity() === true){
            addValidClass(field);
            return true;
        }
        else{
            addInvalidClass(field);
            return false;
        }
    }
    //adding of in-valid/valid class bootstrap
    //show the invalid messages response
    const addInvalidClass = field => {
        field.classList.remove('is-valid');
        field.classList.add('is-invalid');
    };
    const addValidClass = field => {
        field.classList.remove('is-invalid');
        field.classList.add('is-valid');
    }
    const removeValidClass = field => field.classList.remove('is-valid');
    const removeInvalidClass = field => field.classList.remove('is-invalid');
    //stop default action of rom
    const stopDefaultFormAction = e => {
        e.preventDefault();
        e.stopPropagation();
    }
    /////////////////////////////////////////////
    //------- End of Helper Functions ---------//
    /////////////////////////////////////////////

})()

