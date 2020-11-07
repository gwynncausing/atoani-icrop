let tableData = null;
let csrf_token = null;
let selectedOrderID = -1;

function setCSRFToken(csrf){
  csrf_token = csrf
}

//ajax urls
const getAllOrdersURL = '/admin/get-all-orders/';
const getUnapprovedOrdersURL = '/admin/get-unapproved-orders/';
const getApprovedOrdersURL = '/admin/get-approved-orders/';
const getOngoingOrdersURL = '/admin/get-ongoing-orders/';
const getHarvestedOrdersURL = '/admin/get-harvested-orders/';
const getCollectedOrdersURL = '/admin/get-collected-orders/';
const getDeliveredOrdersURL = '/admin/get-delivered-orders/';
const getCancelledOrdersURL = '/admin/get-cancelled-orders/';
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

const ordersTableConfig = {
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
      targets: 4,
      data: null,
      defaultContent: `<div class="button-container d-flex justify-content-center">
                            <button type="button" class="view-order-btn outline-none border-0 bg-transparent mx-1 opbtn" onclick="viewOrder(this)">
                                View Details
                            </button>
                            </div>`
    }
  ],
  ajax: {
    url: getAllOrdersURL,
    data: "data",
  },
  //matches the data to appropriate column
  columns: [
    { "data": 'order_id' },
    { "data": 'crop_name'},
    { "data": 'customer_name' },
    { "data": 'status' }
  ],
  createdRow: function(row, data, dataIndex) {
    $(row).attr('order-id', data.order_id);
    $(row).attr('order-status', data.status);
  },
  initComplete: function(){
    tableData = ordersTable.ajax.json().data;
  }
};


function viewOrder(button){
  selectedOrderID = button.parentNode.parentNode.parentNode.getAttribute("order-id");
  selectedOrderStatus = button.parentNode.parentNode.parentNode.getAttribute("order-status");
  let order = null;
  for(let i = 0; i < tableData.length; i++){
    if(tableData[i].order_id == selectedOrderID && tableData[i].status == selectedOrderStatus){
      order = tableData[i];
      break;
    }
  }
  document.getElementById('order-id').innerHTML = String(order.order_id);
  document.getElementById('crop-name').innerHTML = order.crop_name;
  document.getElementById('customer-id').innerHTML = order.customer_id;
  document.getElementById('weight').innerHTML = order.weight + " kg";
  document.getElementById('customer-name').innerHTML = order.customer_name;
  document.getElementById('location').innerHTML = order.location;
  document.getElementById('farmer-id').innerHTML = order.farmer_id || "N/Asdsd";
  document.getElementById('status').innerHTML = order.status;
  document.getElementById('farmer-name').innerHTML = order.farmer_name || "N/A";
  document.getElementById('date-ordered').innerHTML = String(order.order_date) || "N/A";
  // document.getElementById('date-reserved').innerHTML = String(order.order_date)
  // document.getElementById('date-collected').innerHTML = String(order.order_date)
}

function showElement(e){
  e.style.display = "block";
}

function hideElement(e){
  e.style.display = "none";
}

function resetViewOrder(){
  selectedOrderID = -1;
  document.getElementById('order-id').innerHTML = "-";
  document.getElementById('crop-name').innerHTML = "-";
  document.getElementById('customer-id').innerHTML = "-";
  document.getElementById('weight').innerHTML = "-";
  document.getElementById('customer-name').innerHTML = "-";
  document.getElementById('location').innerHTML = "-";
  document.getElementById('farmer-id').innerHTML = "-";
  document.getElementById('status').innerHTML = "-";
  document.getElementById('farmer-name').innerHTML = "-";
  document.getElementById('date-ordered').innerHTML = "-";
}

function getDataFromServer(url){
  ordersTable.ajax.url(url).load(()=>{tableData = ordersTable.ajax.json().data;},true)
}

function processOrder(orderID,viewURL){
  let formData = new FormData();//.append('action','add');
  formData.append('order-id', orderID);
  formData.append('csrfmiddlewaretoken',csrf_token);
  $.ajax({
    url: viewURL,
    type: 'post',
    //data to be passed to django view
    data: formData,
    contentType: false,
    processData: false,
    success: function (response) {
      alert("Request processed successfully");
      ordersTable.ajax.reload(()=>{tableData = ordersTable.ajax.json().data;},true);
      resetViewOrder();
      selectedOrderID = -1;
    },
    error: function (response) {
      alert("Something went wrong in the server");
    }
  });
}

let ordersTable = null;

const allBtn = document.getElementById("allBtn");
const waitlistBtn = document.getElementById("waitlistBtn");
const approvedBtn = document.getElementById("approvedBtn");
const ongoingBtn = document.getElementById("ongoingBtn");
const harvestedBtn = document.getElementById("harvestedBtn");
const collectedBtn = document.getElementById("collectedBtn");
const deliveredBtn = document.getElementById("deliveredBtn");
const cancelledBtn = document.getElementById("cancelledBtn");

const cancelBtn = document.getElementById("cancelBtn");
const approveBtn = document.getElementById("approveBtn");
const collectBtn = document.getElementById("collectBtn");
const harvestBtn = document.getElementById("harvestBtn");
const deliverBtn = document.getElementById("deliverBtn");

const labelTop = document.getElementById("labelTop");

function initializeButtons(){
  allBtn.addEventListener("click",e => {
    labelTop.innerHTML = "All";
    resetViewOrder();
    showElement(cancelBtn);
    hideElement(approveBtn);
    hideElement(harvestBtn);
    hideElement(collectBtn);
    hideElement(deliverBtn);
    getDataFromServer(getAllOrdersURL);
  });
  waitlistBtn.addEventListener("click",e => {
    labelTop.innerHTML = "Pending";
    resetViewOrder();
    hideElement(cancelBtn);
    showElement(approveBtn);
    hideElement(harvestBtn);
    hideElement(collectBtn);
    hideElement(deliverBtn);
    getDataFromServer(getUnapprovedOrdersURL);
  });
  approvedBtn.addEventListener("click",e => {
    labelTop.innerHTML = "Approved";
    resetViewOrder();
    hideElement(cancelBtn);
    hideElement(approveBtn);
    hideElement(harvestBtn);
    hideElement(collectBtn);
    hideElement(deliverBtn);
    getDataFromServer(getApprovedOrdersURL);
  });
  ongoingBtn.addEventListener("click",e => {
    labelTop.innerHTML = "Ongoing";
    resetViewOrder();
    hideElement(cancelBtn);
    hideElement(approveBtn);
    showElement(harvestBtn);
    hideElement(collectBtn);
    hideElement(deliverBtn);
    getDataFromServer(getOngoingOrdersURL);
  });
  harvestedBtn.addEventListener("click",e => {
    labelTop.innerHTML = "Harvested";
    resetViewOrder();
    hideElement(cancelBtn);
    hideElement(approveBtn);
    hideElement(harvestBtn);
    showElement(collectBtn);
    hideElement(deliverBtn);
    getDataFromServer(getHarvestedOrdersURL);
  });
  collectedBtn.addEventListener("click",e => {
    labelTop.innerHTML = "Collected";
    resetViewOrder();
    hideElement(cancelBtn);
    hideElement(approveBtn);
    hideElement(collectBtn);
    showElement(deliverBtn);
    getDataFromServer(getCollectedOrdersURL);
  });
  deliveredBtn.addEventListener("click",e => {
    labelTop.innerHTML = "Delivered";
    resetViewOrder();
    hideElement(cancelBtn);
    hideElement(approveBtn);
    hideElement(collectBtn);
    hideElement(deliverBtn);
    getDataFromServer(getDeliveredOrdersURL);
  });
  cancelledBtn.addEventListener("click",e => {
    labelTop.innerHTML = "Cancelled";
    resetViewOrder();
    hideElement(cancelBtn);
    hideElement(approveBtn);
    hideElement(collectBtn);
    hideElement(deliverBtn);
    getDataFromServer(getCancelledOrdersURL);
  });

  cancelBtn.addEventListener("click", e => {
    if (selectedOrderID != -1)
      processOrder(selectedOrderID,getAllOrdersURL);
    else
      alert("Select an order first.");
  });
  approveBtn.addEventListener("click", e => {
    if (selectedOrderID != -1)
      processOrder(selectedOrderID,getUnapprovedOrdersURL);
    else
      alert("Select an order first.");
  });
  harvestBtn.addEventListener("click", e => {
    if (selectedOrderID != -1)
      processOrder(selectedOrderID,getOngoingOrdersURL);
    else
      alert("Select an order first.");
  });
  collectBtn.addEventListener("click", e => {
    if (selectedOrderID != -1)
      processOrder(selectedOrderID,getHarvestedOrdersURL);
    else
      alert("Select an order first.");
  });
  deliverBtn.addEventListener("click", e => {
    if (selectedOrderID != -1)
      processOrder(selectedOrderID,getCollectedOrdersURL);
    else
      alert("Select an order first.");
  });
}

function initialize(){
  ordersTable = $('.orders-table').DataTable(ordersTableConfig);
  hideElement(approveBtn);
  hideElement(collectBtn);
  hideElement(harvestBtn);
  hideElement(deliverBtn);
  initializeButtons();
}


