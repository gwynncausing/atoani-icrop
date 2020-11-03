

function checkFromServer(inputElement,inputName){
    inputElement.classList.remove('is-valid');
    inputElement.classList.remove('is-invalid');
    const form = document.querySelector("#form-contact");
    doesInputExist(form,inputElement,inputName);
}

function doesInputExist(form,inputElement,inputName){
    let formData = new FormData(form);
    formData.append('input',inputName);
    $.ajax({
        url: '',
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        success: function(response){
            inputElement.classList.add('is-valid');
            console.log(response.result);
        },
        error: function(response){
            inputElement.classList.add('is-invalid');
        }
    });
}


$(document).ready(function () {
    const csrf_token = document.getElementsByName('csrfmiddlewaretoken');
    const firstname = document.getElementById('first-name');
    const lastname = document.getElementById('last-name');
    const contact_number = document.getElementById('contact-num');
    const email = document.getElementById('email');
    const land_area = document.getElementById('land-area');
    const company = document.getElementById('company');
    const id = document.getElementById("location-id");
    const province = document.getElementById("province");
    const city = document.getElementById("city");
    const brgy = document.getElementById("barangay");
    const name = document.getElementById("address");
    const contactInfo = document.querySelector("#contact-info");
    const location_id_delete = document.getElementById('location-id-delete');
    const current_pass = document.getElementById('current-password');
    const new_password1 = document.getElementById('new_password1');
    const new_password2 = document.getElementById('new_password2');


    let isEmailValid = false;
    let isContactValid = false;

    //Error Messages
    const contact_num_feedback = document.getElementById('contact-num-feedback')
    const contact_num_feedback_div = document.getElementById('contact-num-feedback-div');

    const email_feedback = document.getElementById('email-feedback')
    const email_feedback_div = document.getElementById('email-feedback-div');


    const contact_form = document.getElementById('form-contact');

    const contactInvalidFormat = "Phone number must be in this format 09xxxxxxxxx";
    const contactExists = "The contact number is already in use";
    const emailInvalidFormat = "Please enter your email address in format: yourname@example.com";
    const emailExists = "The email address is already in use";

    //password Helper function
    passwordHelper.init($("#new_password1"), $("#new_password2"));

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

    const stopDefaultFormAction = e => {
        e.preventDefault();
        e.stopPropagation();
    }

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


    // let isEmailValid = false;
    // let isContactValid = false;

    email.addEventListener("input", (e) => {  
        //if input length is 0
        //make it neutral
        if(e.target.value.toString().length === 0){
            removeValidClass(email);
            removeInvalidClass(email)
            isEmailValid = false;
        }else{
            isEmailValid = displayValidity(e.target);
            if(isEmailValid){
                email.classList.add("is-invalid");
                email_feedback.innerHTML = contactExists;
                checkFromServer(email,'email');
            }
            else
                email_feedback.innerHTML = emailInvalidFormat;
        }
    })

    contact_number.addEventListener('input', e => {
        e.target.value = e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
        //if input length is 0
        //make it neutral
        if(e.target.value.toString().length === 0){
            removeValidClass(contact_number);
            removeInvalidClass(contact_number)
            isContactValid = false;
        }else{
            isContactValid = displayValidity(e.target);
            if(isContactValid){
                // check if it exists
                contact_number.classList.add("is-invalid");
                contact_num_feedback.innerHTML = contactExists;
                checkFromServer(contact_number,'contact_number');
            }
            else
                contact_num_feedback.innerHTML = contactInvalidFormat;
        }
    })

    // CONTACT FORM
    /*
    contact_form.addEventListener("submit", e => {
        let isValid = true;

        if(isEmailValid || isContactValid){
            contactInfo.value = "contact-info";
            isValid = displayValidity(contactInfo);
        }
        
        //check the validity of each fields
        textFields.forEach(field => {
            if(field.classList.contains("is-invalid"))
                isValid = displayValidity(field);
        });

        if(isValid == false)
            stopDefaultFormAction(e);
        
    })
    */

    // ajax requests
    $('#btn-save-name').click(function(e){
        e.preventDefault();
        $.ajax({
            url: '/settings/',
            type: 'POST',
            data: {
                'csrfmiddlewaretoken' : csrf_token[0].value,
                'firstname' : firstname.value,
                'lastname' : lastname.value,
                'btn-save-name' : $(this).html()
            },
            success: function(response){
                $("#modal-message").modal('toggle');
                console.log(response);
            },
            error: function(response){
                console.log(response);
            }
        });
    });

    $('#btn-save-contact').click(function(e){
        e.preventDefault();
        
        //make sure that either of the fields is valid
        if(contact_number.classList.contains("is-invalid") == false && email.classList.contains("is-invalid") == false){
            $.ajax({
                url: '/settings/',
                type: 'POST',
                data: {
                    'csrfmiddlewaretoken' : csrf_token[0].value,
                    'contact_number' : contact_number.value,
                    'email' : email.value,
                    'btn-save-contact' : $(this).html()
                },
                success: function(response){
                    $("#modal-message").modal('toggle');
                    console.log(response);
                },
                error: function(response){
                    console.log(response);
                }
            });
        }
    });

    $('#btn-save-others').click(function(e){
        e.preventDefault();
        $.ajax({
            url: '/settings/',
            type: 'POST',
            data: {
                'csrfmiddlewaretoken' : csrf_token[0].value,
                'land_area' : land_area.value,
                'company' : company.value,
                'btn-save-others' : $(this).html()
            },
            success: function(response){
                console.log(response);
                $("#modal-message").modal('toggle');
            },
            error: function(response){
                console.log(response);
            }
        });
    });

    $('#btn-add-customer-address').click(function(e){
        e.preventDefault();
        $.ajax({
            url: '/settings/',
            type: 'POST',
            data: {
                'csrfmiddlewaretoken' : csrf_token[0].value,
                'province' : province.value,
                'city' : city.value,
                'brgy' : brgy.value,
                'btn-add-customer-address' : $(this).html()
            },
            success: function(response){
                console.log(response);
                $("#modal-message-added").modal('show');
            },
            error: function(response){
                console.log(response);
            }
        });
    });

    $('#btn-edit-farmer-address').click(function(e){
        e.preventDefault();
        $.ajax({
            url: '/settings/',
            type: 'POST',
            data: {
                'csrfmiddlewaretoken' : csrf_token[0].value,
                'id' : id.value,
                'province' : province.value,
                'city' : city.value,
                'brgy' : brgy.value,
                'btn-edit-farmer-address' : $(this).html()
            },
            success: function(response){
                console.log(response);
                name.value = response.name;
                $("#modal-message").modal('show');
            },
            error: function(response){
                console.log(response);
            }
        });
    });

    $('#btn-edit-customer-address').click(function(e){
        e.preventDefault();
        $.ajax({
            url: '/settings/',
            type: 'POST',
            data: {
                'csrfmiddlewaretoken' : csrf_token[0].value,
                'location-id' : id.value,
                'province' : province.value,
                'city' : city.value,
                'brgy' : brgy.value,
                'btn-edit-customer-address' : $(this).html()
            },
            success: function(response){
                console.log(response);
                $("#modal-message").modal('show');
            },
            error: function(response){
                console.log(response);
            }
        });
    });
    
    $('#btn-delete-address').click(function(e){
        console.log("clicked delete")
        e.preventDefault();
        $.ajax({
            url: '/settings/',
            type: 'POST',
            data: {
                'csrfmiddlewaretoken' : csrf_token[0].value,
                'location-id-delete' : location_id_delete.value,
                'btn-delete-address' : $(this).html()
            },
            success: function(response){
                console.log(response);
                $("#modal-message-deleted").modal('show');
            },
            error: function(response){
                console.log(response);
            }
        });
    });
    
    $('#btn-save-account').click(function(e){
        console.log("clicked account")
        e.preventDefault();
        if(passwordHelper.passwordValidity == true && passwordHelper.passwordConfirmValidity == true) {
            $.ajax({
                url: '/settings/',
                type: 'POST',
                data: {
                    'csrfmiddlewaretoken' : csrf_token[0].value,
                    'current_pass' : current_pass.value,
                    'new_password1': new_password1.value,
                    'new_password2': new_password2.value,
                    'btn-save-account' : $(this).html()
                },
                success: function(response){
                    // console.log(response);
                    // $("#modal-message-deleted").modal('show');
                    if(response.password_status == "incorrect")
                        document.getElementById("current-password").classList.add("is-invalid");
                    else if(response.password_status == "successful"){
                        $("#modal-message").modal('show');
                        current_pass.value = "";
                        new_password1.value = "";
                        new_password2.value = "";
                        passwordHelper.reset();
                        document.getElementById("current-password").classList.remove("is-invalid");
                    }
                    else if(response.password_status == "passwords not same")
                        document.getElementById("new_password2").classList.add("is-invalid");
                },
                error: function(response){
                    console.log(response);
                }
            });
        }
        else
            console.log("invalid");
    });

    $('#account').on('hidden.bs.collapse', function () {
        current_pass.value = "";
        new_password1.value = "";
        new_password2.value = "";
        passwordHelper.reset();
        document.getElementById("current-password").classList.remove("is-invalid");
    })

    // open edit address modal
    $(document).on("click", "#btn-edit-address-modal", function () {
        document.getElementById("customer-modal-title").innerHTML = "Edit Address"
        var location_id = $(this).data('location-id');
        console.log(location_id)
        //set id
        $(".modal-body #location-id").val(location_id);
        $('#modal-customer-address').modal('show');
        console.log("open edit")

        document.getElementById("btn-edit-customer-address").removeAttribute("type", "hidden")
        document.getElementById("btn-add-customer-address").setAttribute("type", "hidden");
    });

    //open add address modal
    $(document).on("click", "#btn-add-address-modal", function () {
        document.getElementById("customer-modal-title").innerHTML = "Add Address"
        $('#modal-customer-address').modal('show');
        console.log("open add")

        document.getElementById("btn-add-customer-address").removeAttribute("type", "hidden")
        document.getElementById("btn-edit-customer-address").setAttribute("type", "hidden");
    });

    //open delete address modal
    $(document).on("click", "#btn-delete-address-modal", function () {
        var location_id = $(this).data('location-id');
        var location_name = $(this).data('location-name')
        document.getElementById("customer-modal-title").innerHTML = "Add Address"

        console.log("open delete modal")
        console.log(location_id)
        console.log(location_name)

        $(".modal-body #location-id-delete").val(location_id);
        document.getElementById("location-name-delete").innerHTML = location_name;

        $('#modal-delete').modal('show');
        // $( "#locations" ).load(window.location.href + " #locations" );
    });

});
