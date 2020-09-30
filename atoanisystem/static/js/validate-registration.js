( validate = () => {
    
    const forms = document.querySelector(".registration-form")
    const textFields = forms.querySelectorAll("form input[required]")
    
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
