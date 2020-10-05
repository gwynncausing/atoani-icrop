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

        //check if both passwords are the same
        if(!isPasswordsSame(password.value, passwordConfirm.value)){
            passwordConfirm.classList.remove("is-valid");
            passwordConfirm.classList.add("is-invalid")

            e.preventDefault();
            e.stopPropagation();
        }

    })

    /*start - Important Listeners*/
    
    //required field event input listeners
    textFields.forEach(field => {
        field.addEventListener("input", e => {
            if(e.target.id !== "pr-password" && e.target.name !== "contact_number")
                displayValidity(e.target)
        })
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
        else
            isEmailValid = displayValidity(e.target);
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
            isContactValid = displayValidity(e.target);

            //check if email exist or not
            if(isContactValid === true)
                checkContactFromServer(contact)
        }
    })

    //contact.addEventListener('input',(e) => {
        //checkContactFromServer(contact);
    //    displayValidity(contact);
    //});

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


    function checkContactFromServer(button){
        button.classList.remove('is-valid');
        button.classList.remove('is-invalid');
        checkContactNumber(button);
    }
    
    function checkContactNumber(input){
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
     /*end - Helper Functions*/

})()

