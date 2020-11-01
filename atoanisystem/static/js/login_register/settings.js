// console.log(form_name);

// const url = "/settings/";

// form_name.addEventListener('submit', (e) =>{
//     e.preventDefault();
//     $.ajax({
//         type: 'POST',
//         url : url,
//         data: {
//             'csrfmiddlewaretoken' : csrf[0].value,
//             'firstname' : firstname.value,
//             'lastname' : lastname.value
//         },
//         success: function(response){
//             console.log("response: " + response);
//         },
//         error: function(error){
//             console.log(error);
//         }
//     })
// })



function refreshLocations(){
    $("#locations").html("");
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
    // const street = document.getElementById("street");
    const name = document.getElementById("address");
    const location_id_delete = document.getElementById('location-id-delete');



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
                // 'street' : street.value,
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
                // 'street' : street.value,
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
                // 'street' : street.value,
                'btn-edit-customer-address' : $(this).html()
            },
            success: function(response){
                console.log(response);
                // name.value = response.name;
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
    

    const username = document.getElementById('username');
    const current_pass = document.getElementById('current-password');
    const new_password1 = document.getElementById('new_password1');
    const new_password2 = document.getElementById('new_password2');

    $('#btn-save-account').click(function(e){
        console.log("clicked account")
        e.preventDefault();
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
                console.log(response);
                // $("#modal-message-deleted").modal('show');
            },
            error: function(response){
                console.log(response);
            }
        });
    });

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


