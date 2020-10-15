(() =>{
    const orderForm = document.querySelector("#customer-order-form");
    const demand = document.querySelector("input[name=demand]");


    orderForm.addEventListener("submit", e => {
        if(orderForm.checkValidity() === false){
            e.preventDefault();
            e.stopPropagation();
        }

        orderForm.classList.add("was-validated");
    })

    demand.addEventListener("input", e => {
        e.target.value = e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1')
    });


})()