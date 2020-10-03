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

( validate = () => {
    const forms = document.querySelector(".registration-form")
    const textFields = forms.querySelectorAll("form input[required]")
    //Calls necessary validation functions
    forms.addEventListener("submit", e => {
        
        //checkContactFromServer(contact);
        
        if(forms.checkValidity() === false){
            e.preventDefault();
            e.stopPropagation();
        }
        
        //forms.classList.add('was-validated');
        textFields.forEach(field => {
            if(field.name !== "password" && field.name != 'confirm-password')
                displayValidity(field);
            else{
                if(field.name === 'confirm-password'){
                    if(isPassWordsSame(field.value, password.value) === false){
                        field.classList.remove('is-valid');
                        field.classList.add('is-invalid');

                        e.preventDefault();
                        e.stopPropagation();
                    }
                }
            }
        })

        //if(isPasswordValid === false)
        //    console.log("hello")
        //    consoleshowMessage();

        //e.preventDefault();
        //e.stopPropagation();
    })

    //Adds event listener to all required textfields
    textFields.forEach(field => {
        field.addEventListener("input", e => {
            //console.log(e.target.id)
            if(e.target.id !== "pr-password"){
                displayValidity(e.target)
                //console.log("password not allowed here");
            }
        })
    })

    const email = document.getElementById('email');
    email.addEventListener("input", (e) => {
        displayValidity(e.target);
    })

    //Displays the validation message/response
    const displayValidity = (field) => {
        field.classList.remove('is-valid');
        field.classList.remove('is-invalid');

        if(field.checkValidity() === true)
            field.classList.add('is-valid');
        else
            field.classList.add('is-invalid');
    }

    const password = document.getElementById('pr-password');
    password.addEventListener('click', (e) => {
        if(e.target.classList.contains('fa-eye')){
            e.target.classList.add('fa-eye-slash');
            e.target.classList.remove('fa-eye');
            $('#pr-password').prop('type', 'text');
        }
        else{
            e.target.classList.add('fa-eye');
            e.target.classList.remove('fa-eye-slash');
            $('#pr-password').prop('type', 'password');
        }
    })
    const passwordConfirm = document.getElementById('confirm-password');
    passwordConfirm.addEventListener('click', (e) => {
        if(e.target.classList.contains('fa-eye')){
            e.target.classList.add('fa-eye-slash');
            e.target.classList.remove('fa-eye');
            $('#confirm-password').prop('type', 'text');
        }
        else{
            e.target.classList.add('fa-eye');
            e.target.classList.remove('fa-eye-slash');
            $('#confirm-password').prop('type', 'password');
        }        
    });
    
    const contact = document.getElementById('contact-number');
    contact.addEventListener('input',(e) => {
        checkContactFromServer(contact);
        displayValidity(contact);
    });

    $('#confirm-password').on('input', (e) => {
        $('#confirm-password').removeClass('is-valid');
        $('#confirm-password').removeClass('is-invalid');

        if(isPassWordsSame($('#pr-password').val(), e.target.value))
            $('#confirm-password').addClass("is-valid")
        else
            $('#confirm-password').addClass("is-invalid")
        
        console.log("hello")
    })

    const isPassWordsSame = (p1, p2) => p1 === p2;

    

})()

