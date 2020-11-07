(() =>{
    const urlCreateOrder = "/dashboard/customer/";

    const inputs = $("input, select");
    const orderForm = $("#customer-order-form");
    const demand = $("input[name=weight]");
    const customAddress = $("#custom-address");
    const customAddressHolder = $("#custom-address-holder");    
    const addressesOnFile = $(".addresses-on-file");    
    const modalOrder = $(".modal-order");    
    const inputTexts = $("input[type=text]");    
    const defaultAddress = $(".default-address"); 
    const cropName = $("[name=crop-id]");

    //located on the modal footer
    const confirmTag = $("#confirmOrderMsg");   
    const orderBtn = $("#order-btn");
    const noBtn = $("#no-btn");
    const yesBtn = $("#yes-btn");
    const cancelBtn = $("#cancel-btn");

    const provinceSelector = document.querySelector("select[name=province]");

    let isCustomAddressClicked = false

    //when the order button is clicked
    //check first the validity of the form
    //if valid, show confirmation tag
    //else, show validation guide
    orderBtn.on("click", e => {
        if(validity() === true){
            setInputDisabled(true);

            //show yes, no, and confirm tag
            yesBtn.removeClass("d-none");
            noBtn.removeClass("d-none");
            confirmTag.removeClass("d-none");
            
            //hide the order/cancel button
            orderBtn.addClass("d-none");
            cancelBtn.addClass("d-none");
        }
    });

    yesBtn.on("click", e => {
        yesBtn.prop("disabled", true);
        orderForm.submit();
    });
    //when the user click yes to confirm 
    //this submit the form
    orderForm.on("submit", e => {
        e.preventDefault();
        yesBtn.prop("disabled", true);
        $('#modal-create-order').modal('hide');
        if(validity() === true)
            createOrder();
    });


    //make the demand input accept only numbers
    demand.on("input", e => {
        e.target.value = e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1')
        if(e.target.value != ''){
            demand.addClass("is-valid");
            demand.removeClass("is-invalid");
        }
        else{
            demand.addClass("is-invalid");
            demand.removeClass("is-valid");
        }
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
        if($("#province option:selected").val() == '-1')
            $("[name=city], [name=barangay]").prop("disabled", true);
    })

    //detect change in province selector
    provinceSelector.addEventListener("change", e => {
        $('select[name=city]').prop('disabled', false);
        $('select[name=barangay]').prop('disabled', false);
        provinceSelector.classList.remove("is-invalid");
        provinceSelector.classList.add("is-valid");
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

        demand.removeClass("is-invalid is-valid");
        cropName.removeClass("is-invalid is-valid");
        provinceSelector.classList.remove("is-invalid");
        provinceSelector.classList.remove("is-valid");

        if(isCustomAddressClicked == true){
            customAddressHolder.slideToggle( 280, () => {});
            isCustomAddressClicked = false;
        }
    }

    //set the disability of the inputs
    const setInputDisabled = boolean => {
        inputs.prop('disabled', boolean)
    }

    //check the validity
    const validity = () => {
        let isValid = true;
        //make all important inputs neutral
        demand.removeClass("is-valid");
        demand.removeClass("is-invalid");
        provinceSelector.classList.remove("is-valid");
        provinceSelector.classList.remove("is-invalid");
        //crop name is already valid
        cropName.addClass("is-valid");
        
        if(demand[0].checkValidity())
            demand.addClass("is-valid")
        else{
            demand.addClass("is-invalid");
            isValid = false;
        }

        //if custom address is chosen, then do this
        if(customAddress.is(':checked')){
            //check the validity of the province
            if(provinceSelector.options[provinceSelector.selectedIndex].value === "-1"){
                provinceSelector.classList.add("is-invalid")
                isValid = false;
            }
            else        
                provinceSelector.classList.add("is-valid")
        }
        
        return isValid;
    }

    const createOrder = () => {
        //show the loading ui
        $(".loading").removeClass("d-none");

        const formData = new FormData();
        //workaround for form data not capturing values of the orderForm when passed to its constructor
        const elements = orderForm[0].elements;
        for(i=0;i < elements.length; i++){
            if(elements[i].name == "address"){
                //only a single location id will be sent to the form
                if(elements[i].checked)
                    formData.append(elements[i].name,elements[i].value)
                continue;
            }
            formData.append(elements[i].name,elements[i].value)
        }
        //instead of adding default address to html form
        formData.append("original-address", $(".default-address").val());
        formData.append("operation","create-order")
        
        $.ajax({
            url: urlCreateOrder,
            type: 'post',
            data: formData,
            contentType: false,
            processData: false,
            success: function(response){
                //this total table came from customer dashboard
                //update the all the table
                pendingTable.ajax.reload( ()=> {
                    pending_data = pendingTable.ajax.json().data;
                    $("#pending-orders-counter").html(pending_data.length)
                },true );
                reservedTable.ajax.reload( () => {
                    resevered_data = reservedTable.ajax.json().data;
                    $("#reserved-orders-counter").html(resevered_data.length)
                },true );
                finishedTable.ajax.reload( () => { 
                    finished_data = finishedTable.ajax.json().data;
                    $("#finished-orders-counter").html(finished_data.length)
                },true );

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