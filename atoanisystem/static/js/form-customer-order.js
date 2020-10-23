
let csrf_token = null;
function setCSRF(value){
    csrf_token = value;
}

(() =>{
    const urlCreateOrder = "/dashboard/customer/";

    const inputs = $("input");
    const orderForm = $("#customer-order-form");
    const demand = $("input[name=demand]");
    const customAddress = $("#custom-address");
    const customAddressHolder = $("#custom-address-holder");    
    const addressesOnFile = $(".addresses-on-file");    
    const modalOrder = $(".modal-order");    
    const inputTexts = $("input[type=text]");    
    const defaultAddress = $(".default-address"); 
    
    //located on the modal footer
    const confirmTag = $("#confirmOrderMsg");   
    const orderBtn = $("#order-btn");
    const noBtn = $("#no-btn");
    const yesBtn = $("#yes-btn");
    const cancelBtn = $("#cancel-btn");

    const provinceSelector = $("select[name=province]");

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
        //console.log(orderForm.serialize());
        yesBtn.prop("disabled", true);
        $('#modal-create-order').modal('hide');
        e.preventDefault();
        if(orderForm[0].checkValidity())
            createOrder();
        
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
        noBtn.addClass("d-none");

        orderBtn.removeClass("d-none");
        cancelBtn.removeClass("d-none");
        
        confirmTag.addClass("d-none");
        yesBtn.addClass("d-none");
        yesBtn.prop("disabled", false);
    });

    //resets the modal when close
    modalOrder.on('hidden.bs.modal', e => {
        resetModal();
    })

    //detect change in province selector
    provinceSelector.on("change", e => {
        $('select[name=city]').prop('disabled', false);
        $('select[name=barangay]').prop('disabled', false);
    });

    //resets the modal order form
    const resetModal = () => {
        inputTexts.val("");

        defaultAddress.prop("checked", true);

        orderForm.removeClass("was-validated");

        noBtn.addClass("d-none");
        orderBtn.removeClass("d-none");
        orderBtn.prop("disabled", false);

        confirmTag.addClass("d-none");

        yesBtn.addClass("d-none");
        yesBtn.prop("disabled", false);
        cancelBtn.removeClass("d-none");

        setInputDisabled(false);

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
        //show the loading ui
        $(".loading").removeClass("d-none");

        const formData = new FormData();
        //workaround for form data not capturing values of the orderForm when passed to its constructor
        const elements = orderForm[0].elements;
        for(i=0;i < elements.length; i++){
            formData.append(elements[i].name,elements[i].value)
        }
        formData.append("operation", "create-order");

        $.ajax({
            url: urlCreateOrder,
            type: 'post',
            data: formData,
            contentType: false,
            processData: false,
            success: function(response){
                //this total table came from customer dashboard
                totalTable.ajax.reload();

                //remove loading 
                $(".loading").addClass("d-none");

                //reset Modal
                resetModal();
                
                //to nofity sucess
                notify('success','Order Success!','Your order is being reviewed.')
            },
            error: function(response){
                //remove loading 
                $(".loading").addClass("d-none");

                //to nofity error
                notify('error','Order Failed!','Please refresh the browser.')

                //reset Modal
                resetModal();
            }
        });
    }

})()