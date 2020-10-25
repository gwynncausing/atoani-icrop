//ajax urls
const getIncomingOrdersUrl = '/dashboard/get-farmer-incoming-orders';
const getReservedOrdersUrl = '/dashboard/get-farmer-reserved-orders';
const getFinishedOrdersUrl = '/dashboard/get-farmer-finished-orders';

let data = null;
let csrf_token = null;
function setCSRF(value){
  csrf_token = value;
}

let reserved_data = null;
let incoming_data = null;
let finished_data = null;

//data table settings
const domPlacements = `<
                        <"d-flex float-left ml-5 mb-3 mt-4"
                            <"mr-3 ml-1"f>
                        >
                        <"d-flex float-right ">
                        <t>
                        <"bottom"
                            <"d-inline"
                                <"float-left mt-0 ml-5 mb-3 pb-3"i>
                            >   
                        >
                      >`;

const farmerFinishedTableConfig = {
  paging: false,
  dom: domPlacements,
  columnDefs: [
    { orderable: false, "targets": 4 },
    {
      targets: 4,
      data: null,
      defaultContent: `<div class="button-container d-flex justify-content-center">
                            <button type="button" class="btn-secondary mx-1 opbtn" onclick="viewFinishedOrders(this)">
                                View Order
                            </button>
                      </div>`
    }
  ],
  //alternatively you can use the syntax-->>>  ajax: " url 'customer:customer_dashboard' ",
  ajax: {
    url: getFinishedOrdersUrl,
    data: "data",
  },
  //matches the data to appropriate column
  columns: [
    { "data": 'accepted_date' },
    { "data": 'name' },
    { "data": 'weight' },
    { "data": 'harvested_date' },
  ],
  createdRow: function(row, data, dataIndex) {
    $(row).attr('order-pair-id', data.order_pair_id);
  },

  initComplete: function(){
    finished_data = finishTable.ajax.json().data;
  }
};

const farmerReservedTableConfig = {
  paging: false,
  dom: domPlacements,
  columnDefs: [
    { orderable: false, "targets": 4 },
    {
      targets: 4,
      data: null,
      defaultContent: `<div class="button-container d-flex justify-content-center">
                            <button type="button" id=modal-farmer-btn class="btn-secondary mx-1 opbtn" onclick="viewReservedOrders(this)">
                                View Order
                            </button>
                            </div>`
    }
  ],
  //alternatively you can use the syntax-->>>  ajax: " url 'customer:customer_dashboard' ",
  ajax: {
    url: getReservedOrdersUrl,
    data: "data",
  },
  //matches the data to appropriate column
  columns: [
    { "data": 'accepted_date' },
    { "data": 'name' },
    { "data": 'weight' },
    { "data": 'status' },
  ],
  createdRow: function(row, data, dataIndex) {
    $(row).attr('order-pair-id', data.order_pair_id);
  },

  initComplete: function(){
    reserved_data = reservedTable.ajax.json().data;
  }
};

const farmerIncomingTableConfig = {
  paging: false,
  dom: domPlacements,
  columnDefs: [
    { orderable: false, "targets": 4 },
    {
      targets: 4,
      data: null,
      defaultContent: `<div class="button-container d-flex justify-content-center">
                            <button type="button" class="btn-secondary mx-1 opbtn" onclick="viewIncomingOrders(this)">
                                View
                            </button>
                            </div>`
    }
  ],
  ajax: {
    url: getIncomingOrdersUrl,
    data: "data",
  },
  columns: [
    { "data": 'name' },
    { "data": 'weight' },
    { "data": 'land_area_needed' },
    { "data": 'location_id' },
  ],
  createdRow: function(row, data, dataIndex) {
    $(row).attr('order-id', data.order_id);
  },

  initComplete: function(){
    incoming_data = incomingTable.ajax.json().data;
  }
};

//Used to identify the viewed order
let selectedOrderID = 1;
//indicator if the order was reserved temporarily
let isOrderReserved = false;
//Messages and buttons for reservation
const confirmMsg = document.getElementById("confirmReserveMsg");
const failedMsg = document.getElementById("failedReserveMsg");
const successMsg = document.getElementById("successReserveMsg");
const reserveButton = document.getElementById('reserveBtn');
const cancelButton = document.getElementById('cancelReserveBtn');

function viewFinishedOrders(button){
  selectedOrderID = button.parentNode.parentNode.parentNode.getAttribute("order-pair-id");
  let order = null;

  for(let i = 0; i < finished_data.length; i++){
    if(finished_data[i].order_pair_id == selectedOrderID){
      order = finished_data[i];
      break;
    }
  }
  console.log(JSON.stringify(order));
  // document.getElementById('reserved-date-ordered').innerHTML = String(order.order_date);
  // document.getElementById('reserved-date-approved').innerHTML = String(order.date_approved);
  document.getElementById('finished-date-reserved').innerHTML = String(order.accepted_date);
  document.getElementById('finished-date-harvested').innerHTML = String(order.harvested_date);
  document.getElementById('finished-status').innerHTML = String(order.status);
  document.getElementById('finished-crop-name').innerHTML = String(order.name);
  document.getElementById('finished-demand').innerHTML = String(order.weight) + " kilos";
  document.getElementById('finished-location').innerHTML = String(order.location_id);
  document.getElementById('finished-order-number').innerHTML = String(order.order_pair_id);
  document.getElementById('finished-area-needed').innerHTML = String(order.land_area_needed);
  
  // document.getElementById('reserved-days').innerHTML = String(order.weight);
  $("#finished-modal-farmer").modal("show");
}

function viewReservedOrders(button){
  selectedOrderID = button.parentNode.parentNode.parentNode.getAttribute("order-pair-id");
  console.log(reserved_data);
  let order = null;
  for(let i = 0; i < reserved_data.length; i++){
    if(reserved_data[i].order_pair_id == selectedOrderID){
      order = reserved_data[i];
      break;
    }
  }
  // document.getElementById('reserved-date-ordered').innerHTML = String(order.order_date);
  // document.getElementById('reserved-date-approved').innerHTML = String(order.date_approved);
  document.getElementById('reserved-date-reserved').innerHTML = String(order.accepted_date);
  document.getElementById('reserved-status').innerHTML = String(order.status);
  document.getElementById('reserved-crop-name').innerHTML = String(order.name);
  document.getElementById('reserved-demand').innerHTML = String(order.weight) + " kilos";
  document.getElementById('reserved-location').innerHTML = String(order.location_id);
  document.getElementById('reserved-order-number').innerHTML = String(order.order_pair_id);
  document.getElementById('reserved-area-needed').innerHTML = String(order.land_area_needed);
  

  // document.getElementById('reserved-days').innerHTML = String(order.weight);
  $("#reserved-modal-farmer").modal("show");
}

function viewIncomingOrders(button){
  selectedOrderID = button.parentNode.parentNode.parentNode.getAttribute("order-id");
  let order = null;
  for(let i = 0; i < incoming_data.length; i++){
    if(incoming_data[i].order_id == selectedOrderID){
      order = incoming_data[i];
      break;
    }
  }
  //Initializing displays
  confirmMsg.style.display = "none";
  failedMsg.style.display = "none";
  successMsg.style.display = "none";
  //Initializing buttons
  reserveButton.disabled = false;
  reserveButton.innerHTML = "Reserve"
  cancelButton.innerHTML = "Cancel"
  reserveButton.removeEventListener("click", confirmReservation);
  reserveButton.removeEventListener('click',checkOrder);
  reserveButton.addEventListener('click',checkOrder);
  //Assigning values
  document.getElementById('incoming-date-ordered').innerHTML = String(order.order_date);
  document.getElementById('incoming-date-approved').innerHTML = "Not Yet Approved";
  document.getElementById('incoming-status').innerHTML = String(order.status);
  document.getElementById('incoming-crop-name').innerHTML = String(order.name);
  document.getElementById('incoming-demand').innerHTML = String(order.weight) + " kilos";
  document.getElementById('incoming-location').innerHTML = String(order.location_id);
  document.getElementById('incoming-area-needed').innerHTML = String(order.land_area_needed);
  document.getElementById('incoming-days').innerHTML = String(order.weight);
  $("#incoming-modal-farmer").modal("show");
}

// Checks if order is available
let checkOrder = function() {
  //Disables the button so that while it is fetching  data from server it wont duplicate the request, and because there is no loading indicator yet
  console.log("AWFWAFWAFAWF")
  reserveButton.disabled = true;
  let formData = new FormData();//.append('action','add');
  formData.append('order-id', selectedOrderID);
  formData.append('operation', 'check-order');
  formData.append('csrfmiddlewaretoken',csrf_token);
  $.ajax({
    url: '',
    type: 'post',
    //data to be passed to django view
    data: formData,
    contentType: false,
    processData: false,
    //when successful, change the data in table with new data from server
    success: function (response) {
      //Enables the button back
      reserveButton.disabled = false;
      //Displays message
      if (confirmMsg.style.display === "none")
        confirmMsg.style.display = "block";
      reserveButton.innerHTML = "Yes";
      isOrderReserved = true;
      //Replaces event listener
      reserveButton.removeEventListener('click',checkOrder);
      reserveButton.addEventListener('click',confirmReservation);
    },
    error: function (response) {
      if (failedMsg.style.display === "none")
        failedMsg.style.display = "block";
      reserveButton.disabled = true;
    }
  });
}

//When farmer presses Yes button as confirmation
let confirmReservation = function() {
  cancelButton.disabled = true;
  let formData = new FormData();
  formData.append('order-id', selectedOrderID);
  formData.append('operation', 'confirm-reserve');
  formData.append('csrfmiddlewaretoken',csrf_token);
  //show the loading ui
  $(".loading").removeClass("d-none");
  //close the current modal open
  $("#incoming-modal-farmer").modal("hide");
  $("#reserved-modal-farmer").modal("hide");
  $("#finished-modal-farmer").modal("hide");
  $.ajax({
    url: '',
    type: 'post',
    //data to be passed to django view
    data: formData,
    contentType: false,
    processData: false,
    success: function (response) {
      //Display message
      //remove loading 
      $(".loading").addClass("d-none"); 
      //when modal closes, and a succss notification will display
      notify('success','Reserved Success!','You have successfully reserved an order.')
      isOrderReserved = false;
      
      //This will update the data after reloading the ajax call
      incomingTable.ajax.reload(()=>{incoming_data = incomingTable.ajax.json().data;},true);
      finishTable.ajax.reload(()=>{reserved_data = reservedTable.ajax.json().data;},true);
      reservedTable.ajax.reload(()=>{finished_data = finishTable.ajax.json().data;},true);
    },
    error: function (response) {
      //remove loading 
      $(".loading").addClass("d-none");
      //to nofity error
      notify('error','Reserved Failed!','Sorry but the order is already taken. Please try with other orders.')
    }
  });
}

//To handle the case in which the farmer changes his/her mind while the order is temporarily reserved to him/her
function cancelReservation() {
  let formData = new FormData();//.append('action','add');
  formData.append('order-id', selectedOrderID);
  formData.append('operation', 'cancel-reserve');
  formData.append('csrfmiddlewaretoken',csrf_token);
  $.ajax({
    url: '',
    type: 'post',
    //data to be passed to django view
    data: formData,
    contentType: false,
    processData: false,

    success: function (response) {
      console.log("reservation cancelled");
    },
    error: function (response) {

    }
  });
}
//Customized close modal function, because when the farmer views an incoming order, it is temporarily reserved to him/her, 
function closeModal(){
  //isOrderReserved only becomes false during initialization or if the farmer confirms the reservation
  //if this is true this means that the farmer checked for its availability (it is temporarily reserved) and that we should cancel the reservation or else it would remain reserved
  if(isOrderReserved){
    cancelReservation();
  }
  else
    $(".modal-farmer").modal("hide");
};

var incomingTable = null;
var finishedTable = null;
var reservedTable = null; 

//Executing it all
$(document).ready(function () {
  //Detects if the modal is closed
  $(".modal-farmer").on("hidden.bs.modal", function (e) {
    e.preventDefault();
    closeModal();
  });
  incomingTable = $('.farmer-incoming-table').DataTable(farmerIncomingTableConfig);
  finishTable = $('.farmer-finished-table').DataTable(farmerFinishedTableConfig);
  reservedTable = $('.farmer-reserved-table').DataTable(farmerReservedTableConfig);
  
});
