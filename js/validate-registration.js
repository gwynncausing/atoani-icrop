( validate = () => {
    
    const forms = document.querySelector(".registration-form")
    const textFields = document.querySelectorAll("form input[required]")


    forms.addEventListener("submit", e => {
        if(forms.checkValidity() === false){
            e.preventDefault();
            e.stopPropagation();
        }

        forms.classList.add("was-validated");
    })

    textFields.forEach(field => {
        field.addEventListener("input", e => {
            checkValidity(e.target)
        })
    })

    const checkValidity = (field) => {
        field.classList.remove('is-valid');
        field.classList.remove('is-invalid');

        if(field.checkValidity() === true)
            field.classList.add('is-valid');
        else
            field.classList.add('is-invalid');
    }
        
})()
