(() =>{
   const urlCreateOrder = "";

   const orderForm = $("#customer-order-form");
   const demand = $("input[name=demand]");
   const customAddress = $("#custom-address");
   const customAddressHolder = $("#custom-address-holder");
   const addressesOnFile = $(".address-on-file");

   let isCustomAddressClicked = false
   
   orderForm.on("submit", e => {
       if(orderForm[0].checkValidity() === false){
           e.preventDefault();
           e.stopPropagation();
       }

       orderForm.addClass("was-validated");
   })

   //make the demand input accept only numbers
   demand.on("input", e => {
       e.target.value = e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1')
   });

   //when all address on file radio button is clicked
   //make sure the custom menu address is hidden
   addressesOnFile.on("click", e => {
        if(isCustomAddressClicked == true){
            customAddressHolder.slideToggle( 280, () => {});
            isCustomAddressClicked = false;
        }
   });

   //to show the custom menu address
   customAddress.on("click", e => {
        if(isCustomAddressClicked == false){
            customAddressHolder.slideToggle( 280, () => {});
            isCustomAddressClicked = true;
        }
   })

   const createOrder = () => {
        let formData = new FormData(orderForm);
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

})()