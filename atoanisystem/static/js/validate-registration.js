let checkContactFromServer = function(button){
    return function(){
        button.classList.remove('is-valid');
        button.classList.remove('is-invalid');
        checkContactNumber(button);
    }
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
    
    const contact = document.getElementById('contact-number');
    contact.addEventListener('input',checkContactFromServer(contact));
    //Calls necessary validation functions
    forms.addEventListener("submit", e => {
        //Calls necessary functions if validation fails
        if(forms.checkValidity() === false){
            e.preventDefault();
            e.stopPropagation();
        }
        //Bootstrap was-validated class for sucessful validation
        forms.classList.add("was-validated");
    })

    //Adds event listener to all required textfields
    textFields.forEach(field => {
        field.addEventListener("input", e => {
            displayValidity(e.target)
        })
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
})()

