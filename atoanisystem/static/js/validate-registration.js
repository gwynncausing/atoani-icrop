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

//make this as global variable
const passwordConfirm = document.querySelector("#password-confirm");

//make these variables within this scopse
( validate = () => {
    const forms = document.querySelector(".registration-form")
    const textFields = forms.querySelectorAll("form input[required]")

    const password = forms.querySelector("#pr-password");

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
    //ERROR MESSAGES:

    const usernameBlank  = "Please enter a username. It must not contain a space.";
    const usernameExists = "The username is already in use";

    const contactInvalidFormat = "Phone number must be in one of these formats: 9xxxxxxxxx or 09xxxxxxxxx";
    const contactExists = "The contact number is already in use";

    const emailInvalidFormat = "Please enter your email address in format: yourname@example.com";
    const emailExists = "The email address is already in use";

    let isEmailValid = false;
    let isContactValid = false;


    //Calls necessary validation functions
    forms.addEventListener("submit", e => {

        //check if email or phone number is answered
        if(isEmailValid || isContactValid){
            contactInfo.value = "contact-info";
            displayValidity(contactInfo);
        }

        //check the validity of each fields
        textFields.forEach(field => {
            if(displayValidity(field) == false){
                e.preventDefault();
                e.stopPropagation();
            }
        });


        //check the validity of the province
        if(provinceSelector.options[provinceSelector.selectedIndex].value === "-1"){
            provinceSelector.classList.add("is-invalid")
            provinceSelector.classList.remove("is-valid");
        }

        //check if both passwords are the same
        if(!isPasswordsSame(password.value, passwordConfirm.value)){
            passwordConfirm.classList.remove("is-valid");
            passwordConfirm.classList.add("is-invalid")

            e.preventDefault();
            e.stopPropagation();
        }

    })

    /*start - Important Listeners*/

    farmerRadio.addEventListener('click',e => {landarea.setAttribute("type", "number");});
    customerRadio.addEventListener('click',e => {landarea.setAttribute("type", "hidden");});

    //required field event input listeners
    textFields.forEach(field => {
        field.addEventListener("input", e => {
            if(e.target.id !== "pr-password" && e.target.name !== "contact_number")
                displayValidity(e.target)
        })
    })

    provinceSelector.addEventListener("change", e => {
        provinceSelector.classList.remove("is-invalid")
        provinceSelector.classList.add("is-valid");
    })

    //email input listener
    email.addEventListener("input", (e) => {  
        //if input length is 0
        //make it neutral
        if(e.target.value.toString().length === 0){
            email.classList.remove("is-invalid");
            email.classList.remove("is-valid");
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
        e.target.value = e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');

        console.log(e.target.value.toString().length)

        //if input length is 0
        //make it neutral
        if(e.target.value.toString().length === 0){
            contact.classList.remove("is-invalid");
            contact.classList.remove("is-valid");
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
            contact.classList.remove("is-invalid");
            contact.classList.remove("is-valid");
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

    //password eye/view click listener
    //shows the input password into text
    passwordEye.addEventListener('click', (e) => makePasswordShow(e.target, "#pr-password"));

    //confirm-password eye/view click listener
    //shows the input password into text
    passwordConfirmEye.addEventListener('click', (e) => makePasswordShow(e.target, "#password-confirm"));

    passwordConfirm.addEventListener('input', (e) => {
        passwordConfirm.classList.remove('is-valid');
        passwordConfirm.classList.remove('is-invalid');

        if(isPasswordsSame(password.value, e.target.value))
            passwordConfirm.classList.add("is-valid")
        else
            passwordConfirm.classList.add("is-invalid")
        
    })

    /*end - Important Listeners*/

    /*start - Helper Functions*/
    //show or not the input password into text
    const makePasswordShow = (field, id) => {
        if(field.classList.contains('fa-eye')){
            field.classList.add('fa-eye-slash');
            field.classList.remove('fa-eye');
            $(id).prop('type', 'text');

            console.log("Show password")
        }
        else{
            field.classList.add('fa-eye');
            field.classList.remove('fa-eye-slash');
            $(id).prop('type', 'password');
            
            console.log("Not show password")
        }
    }

    //displays the validation message/response
    const displayValidity = (field) => {
        field.classList.remove('is-valid');
        field.classList.remove('is-invalid');

        if(field.checkValidity() === true){
            field.classList.add('is-valid');
            return true;
        }
        else{
            field.classList.add('is-invalid');
            return false;
        }
    }

    //check if password and confirm password are same
    const isPasswordsSame = (p1, p2) => p1 === p2;

    
    
    /*end - Helper Functions*/

})()

