//sample
const url = "....";
const form = document.querySelector(".form-crop");

//add crop
function addCrop(e) {
    e.preventDefault();
    
    var formData = new FormData(form);
    console.log(formData)
    console.log("submitted");

    if(!form.checkValidity())
        form.classList.add("was-validated");
    else{
        //show the loading ui
        $(".loading").removeClass("d-none");
        $.ajax({
            url: url,
            type: 'post',
            //data to be passed to django view
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                //remove loading 
                $(".loading").addClass("d-none");
                //show notify
                notify('success','Crop Added!','You have successfully added a crop.');
                //hide modal
                $('#modal-add-crop').modal('hide');
            },
            error: function (response) {
                //remove loading 
                $(".loading").addClass("d-none");
                //to nofity error
                notify('error','Order Failed','Something is wrong with the server.');
                //hide modal
                $('#modal-add-crop').modal('hide');
                console.log("hello")
            }
        });
    }
}

function resetModal(){
    form.elements.forEach(function(element){
        element.classList.remove('is-valid');
        element.classList.remove('is-valid');
        element.classList.value = "";
    })
    console.log("hello")
}

//adding crop
form.addEventListener("submit", addCrop);
//reset the modal
$("#modal-add-crop").on('hidden.bs.modal', resetModal);
