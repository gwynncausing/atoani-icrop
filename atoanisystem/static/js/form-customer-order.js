
let csrf_token = null;
function setCSRF(value){
    csrf_token = value;
}

(() =>{
    const urlCreateOrder = "/dashboard/customer/";

    const inputs = $("input, select");
    const orderForm = $("#customer-order-form");
    const demand = $("input[name=demand]");
    const customAddress = $("#custom-address");
    const customAddressHolder = $("#custom-address-holder");    
    const addressesOnFile = $(".address-on-file");    
    const modalOrder = $(".modal-order");    
    const inputTexts = $("input[type=text]");    
    const defaultAddress = $("#default-address");    
    const errorTag = $("#failedOrderMsg");
    const successTag = $("#successOrderMsg");
    const confirmTag = $("#confirmOrderMsg");
    const orderBtn = $("#order-btn");
    const noBtn = $("#no-btn");
    const yesBtn = $("#yes-btn");
    const cancelBtn = $("#cancel-btn");


    let isCustomAddressClicked = false

    //when the order button is clicked
    //check first the validity of the form
    //if valid, show confirmation tag
    //else, show validation guide
    orderBtn.on("click", e => {
        if(orderForm[0].checkValidity() === false)
            orderForm.addClass("was-validated");
        else{
            setInputDisabled(true);

            //show yes, no, and confirm tag
            yesBtn.removeClass("d-none");
            noBtn.removeClass("d-none");
            confirmTag.removeClass("d-none");
            

            //hide the order button
            orderBtn.addClass("d-none");
            cancelBtn.addClass("d-none");
        }
    })

    //when the user click yes to confirm 
    //this submit the form
    orderForm.on("submit", e => {
        yesBtn.prop("disabled", true);
        if(orderForm[0].checkValidity())
            createOrder();
        e.preventDefault();
    });


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

    //confirm tag appear
    //when no button is clicked => inputs are enabled and hide confirm tag
    noBtn.on("click", e => {
        setInputDisabled(false);
        confirmTag.addClass("d-none");
        errorTag.addClass("d-none");
        noBtn.addClass("d-none");

        orderBtn.removeClass("d-none");
        cancelBtn.removeClass("d-none");

        yesBtn.addClass("d-none");
        yesBtn.prop("disabled", false);
    });

    //resets the modal when close
    modalOrder.on('hidden.bs.modal', e => {
        resetModal();
        setInputDisabled(false);
    })

    //resets the modal order form
    const resetModal = () => {
        inputTexts.val("");
        defaultAddress.prop("checked", true);
        orderForm.removeClass("was-validated");

        errorTag.addClass("d-none");
        successTag.addClass("d-none");
        confirmTag.addClass("d-none");
        noBtn.addClass("d-none");


        orderBtn.removeClass("d-none");
        orderBtn.prop("disabled", false);

        yesBtn.addClass("d-none");
        yesBtn.prop("disabled", false);

        if(isCustomAddressClicked == true){
            customAddressHolder.slideToggle( 280, () => {});
            isCustomAddressClicked = false;
        }
    }

    //set the disability of the inputs
    const setInputDisabled = boolean => {
        inputs.prop('disabled', boolean)
    }

    const createOrder = () => {
        const form = document.querySelector(".customer-order-form")
        let formData = new FormData(form);
        formData.append("operation", "create-order");
        
        //temporary
        formData.append("weight", $("[name=weight]").val());
        formData.append("address", $("[name=address]").val());
        formData.append("crop-id", $("[name=crop-id]").val());
        formData.append("street", $("[name=street]").val());
        formData.append("barangay", $("[name=barangay]").val());
        formData.append("city", $("[name=city]").val());
        formData.append("province", $("[name=province]").val());
        
        formData.append('csrfmiddlewaretoken',csrf_token);
        
        $.ajax({
            url: urlCreateOrder,
            type: 'post',
            data: formData,
            contentType: false,
            processData: false,
            success: function(response){
                //this total table came from customer dashboard
                totalTable.ajax.reload();

                //reset Modal
                resetModal();
                setInputDisabled(true);

                orderBtn.prop("disabled", true);
                confirmTag.addClass("d-none");
                successTag.removeClass("d-none");
                cancelBtn.removeClass("d-none");

            },
            error: function(response){
                errorTag.removeClass("d-none");
            }
        });
    }

})()