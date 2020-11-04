let tableData = null;
let csrf_token = null;
let selectedCropID = -1;

function setCSRFToken(csrf) {
  csrf_token = csrf
}

//ajax urls
const getAllCropsURL = '/admin/get-all-crops/';
//data table settings
const domPlacements = `<
                        <"d-flex float-left ml-5 mb-3 mt-4"
                            <"mr-3 ml-1"f>
                            l
                        >
                        <"d-flex float-right ">
                        <t>
                        <"bottom"
                            <"d-inline"
                                <"float-left mt-0 ml-5 mb-3 pb-3"i>
                                <"float-right mt-1"p>
                            >   
                        >
                      >`;

const cropsTableConfig = {
  searching: true,
  //orders the first column as desc by default
  order: [
    [0, 'desc']
  ],
  paging: true,
  pagingType: 'full_numbers',
  //the choices for numbers of entries to be shown
  lengthMenu: [
    [5, 10, 25, 50, -1],
    [5, 10, 25, 50, 'All']
  ],
  dom: domPlacements,
  columnDefs: [
    { orderable: false, "targets": -1 },
    {
      targets: 3,
      data: null,
      defaultContent: `<div class="button-container d-flex justify-content-center">
                                                  <button type="button" class="btn btn-danger text-light py-0" data-toggle="modal" data-target="#confirmDeleteModal" onclick="deleteCrop(this)">
                                                      Delete
                                                  </button>
                                                  </div>`
    }
  ],
  ajax: {
    url: getAllCropsURL,
    data: "data",
  },
  //matches the data to appropriate column
  columns: [
    { "data": 'id' },
    { "data": 'name' },
    { "data": 'location' }
  ],
  createdRow: function (row, data, dataIndex) {
    $(row).attr('crop-id', data.id);
  },
  initComplete: function () {
    tableData = cropsTable.ajax.json().data;
  }
};

let cropsTable = null;

const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

function deleteCrop(button){
  selectedCropID = button.parentNode.parentNode.parentNode.getAttribute("crop-id");
}

function processDeletion(cropID,viewURL){
  let formData = new FormData();//.append('action','add');
  formData.append('crop-id', cropID);
  formData.append('operation', 'delete-crop');
  formData.append('csrfmiddlewaretoken',csrf_token);
  $.ajax({
    url: viewURL,
    type: 'post',
    //data to be passed to django view
    data: formData,
    contentType: false,
    processData: false,
    success: function (response) {
      $("#confirmDeleteModal").modal("hide");
      alert("Crop deleted successfully");
      cropsTable.ajax.reload(()=>{tableData = cropsTable.ajax.json().data;},true);
      selectedCropID = -1;
    },
    error: function (response) {
      alert("Something went wrong in the server");
    }
  });
}

function initialize(){
  cropsTable = $('.crops-table').DataTable(cropsTableConfig);
  confirmDeleteBtn.addEventListener('click',()=>{processDeletion(selectedCropID,getAllCropsURL)});
}


//sample
const url = "....";
const form = document.querySelector(".form-crop");
const inputs = document.querySelectorAll("input, select");
//add crop
function addCrop(e) {
    e.preventDefault();
    if(!form.checkValidity())
        form.classList.add("was-validated");
    else{
        //remove the loader
        $(".loading").removeClass("d-none");
        let formData = new FormData(form);//.append('action','add');
        formData.append('operation', 'add-crop');
        formData.append('csrfmiddlewaretoken',csrf_token);
        $.ajax({
            url: getAllCropsURL,
            type: 'post',
            //data to be passed to django view
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                //remove loading 
                $(".loading").addClass("d-none");
                $('#modal-add-crop').modal('hide');
                cropsTable.ajax.reload(()=>{tableData = cropsTable.ajax.json().data;},true);
                selectedCropID = -1;
                //show notify
                notify('success','Crop Added!','You have successfully added a crop.');
                
            },
            error: function (response) {
                //remove loading 
                $(".loading").addClass("d-none");
                //to nofity error
                notify('error','Order Failed','Something is wrong with the server.');
                //hide modal
                $('#modal-add-crop').modal('hide');
            }
        });
    }
}

//reset the modal
function resetModal(){
  form.classList.remove("was-validated"); 
}
//adding crop
form.addEventListener("submit", addCrop);
//reset the modal
$("#modal-add-crop").on('hidden.bs.modal', resetModal);