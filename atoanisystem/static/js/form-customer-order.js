(() =>{
   const urlCreateOrder = "/dashboard/customer/";

   const errorConnection = "There is a problem in the connection. Please try again or refresh the browser.";

   const orderForm = $("#customer-order-form");
   const demand = $("input[name=demand]");
   const customAddress = $("#custom-address");
   const customAddressHolder = $("#custom-address-holder");
   const addressesOnFile = $(".address-on-file");
   const modalOrder = $(".modal-order");
   const inputTexts = $("input[type=text]");
   const defaultAddress = $("#default-address");
   const errorTag = $("#error-connection-tag");

   let isCustomAddressClicked = false
   
   orderForm.on("submit", e => {
        e.preventDefault();
        e.stopPropagation();

        if(orderForm[0].checkValidity() === false)
            orderForm.addClass("was-validated");
        else     
            createOrder();
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

    modalOrder.on('hidden.bs.modal', e => {
        demand.val("");
        inputTexts.val("");
        defaultAddress.prop("checked", true);

        if(isCustomAddressClicked == true){
            customAddressHolder.slideToggle( 280, () => {});
            isCustomAddressClicked = false;
        }

        errorTag.addClass("d-none");
    })

    const createOrder = () => {
        let formData = new FormData(document.querySelector("#customer-order-form"));
        formData.append("operation", "create-order");

        $.ajax({
            url: urlCreateOrder,
            type: 'post',
            data: formData,
            contentType: false,
            processData: false,
            success: function(response){
                modalOrder.modal('hide');
                //this total table came from customer dashboard
                totalTable.ajax.reload();

            },
            error: function(response){
                errorTag.innerHTML = errorConnection;
                errorTag.removeClass("d-none");
            }
        });
    }

})()