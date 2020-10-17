//ajax urls
const getIncomingOrdersUrl = '/dashboard/get-farmer-incoming-orders';
const getReservedOrdersUrl = '/dashboard/get-farmer-reserved-orders';
const getFinishedOrdersUrl = '/dashboard/get-farmer-finished-orders';

let data = null;
let csrf_token = null;
function setCSRF(value){
  csrf_token = value;
}
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
                            <button type="button" class="btn-secondary mx-1 opbtn" onclick="viewOrders(this)">
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
    $(row).attr('order-id', data.order_id);
  },

  initComplete: function(){
    data = incomingTable.ajax.json().data;
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
                            <button type="button" id=modal-farmer-btn class="btn-secondary mx-1 opbtn" onclick="viewOrders(this)">
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
    $(row).attr('order-id', data.order_id);
  },

  initComplete: function(){
    data = incomingTable.ajax.json().data;
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
                            <button type="button" class="btn-secondary mx-1 opbtn" onclick="viewOrders(this)">
                                View
                            </button>
                            </div>`
    }
  ],
  //alternatively you can use the syntax-->>>  ajax: " url 'customer:customer_dashboard' ",
  ajax: {
    url: getIncomingOrdersUrl,
    data: "data",
  },
  //matches the data to appropriate column
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
    data = incomingTable.ajax.json().data;
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
const cancelButton = document.getElementById('cancelBtn');

//Made by master Rafale Bacalla
function viewOrders(button){
  selectedOrderID = button.parentNode.parentNode.parentNode.getAttribute("order-id");
  let order = null;
  for(let i = 0; i < data.length; i++){
    if(data[i].order_id == selectedOrderID){
      order = data[i];
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
  document.getElementById('date-ordered').innerHTML = String(order.order_date);
  document.getElementById('date-approved').innerHTML = String(order.date_approved);
  document.getElementById('date-reserved').innerHTML = String(order.date_reserved);
  document.getElementById('status').innerHTML = String(order.status);
  document.getElementById('crop-name').innerHTML = String(order.name);
  document.getElementById('demand').innerHTML = String(order.weight) + " kilos";
  document.getElementById('location').innerHTML = String(order.location_id);
  document.getElementById('area-needed').innerHTML = String(order.land_area_needed);
  document.getElementById('days').innerHTML = String(order.weight);
  $("#modal-farmer").modal("show");

}

//Checks if order is available
let checkOrder = function() {
  //Disables the button so that while it is fetching  data from server it wont duplicate the request, and because there is no loading indicator yet
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
  let formData = new FormData();
  formData.append('order-id', selectedOrderID);
  formData.append('operation', 'confirm-reserve');
  formData.append('csrfmiddlewaretoken',csrf_token);
  $.ajax({
    url: '',
    type: 'post',
    //data to be passed to django view
    data: formData,
    contentType: false,
    processData: false,
    success: function (response) {
      //Display message
      if (successMsg.style.display === "none"){
        confirmMsg.style.display = "none";
        successMsg.style.display = "block";
      }
      reserveButton.innerHTML = "Reserved";
      reserveButton.disabled = true;
      cancelButton.innerHTML = "OK"
      isOrderReserved = false;
      //reserveButton.removeEventListener()
    },
    error: function (response) {
      //
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

var incomingTable = null;
var finishedTable = null;
var reservedTable = null;

//Executing it all
$(document).ready(function () {
  //Detects if the modal is closed
  $("#modal-farmer").on("hidden.bs.modal", function () {
    //isOrderReserved only becomes false during initialization or if the farmer confirms the reservation
    //if this is true this means that the farmer checked for its availability (it is temporarily reserved) and that we should cancel the reservation or else it would remain reserved
    if(isOrderReserved){
      cancelReservation();
    }
    //refresh/reload the tables
    incomingTable.ajax.reload();
    finishTable.ajax.reload();
    reservedTable.ajax.reload();
  });
  incomingTable = $('.farmer-incoming-table').DataTable(farmerIncomingTableConfig);
  finishTable = $('.farmer-finished-table').DataTable(farmerFinishedTableConfig);
  reservedTable = $('.farmer-reserved-table').DataTable(farmerReservedTableConfig);
  
});
