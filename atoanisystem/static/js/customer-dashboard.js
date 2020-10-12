

let data = null;

//ajax urls
const getTotalOrdersUrl = '/dashboard/get-customer-total-orders';
const getReservedOrdersUrl = '/dashboard/get-customer-reserved-orders';
const getFinishedOrdersUrl = '/dashboard/get-customer-finished-orders';

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

const customerReservedTableConfig = {
  paging: false,
  dom: domPlacements,
  columnDefs: [
    { orderable: false, "targets": 4 },
    { orderable: false, "targets": 5 },
    {
      targets: 5,
      data: null,
      defaultContent: `<div class="button-container d-flex justify-content-center">
                            <button type="button" class="btn-secondary mx-1 opbtn" data-target="#modal-customer-reserved" onclick="viewReservedOrders(this)">
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
    { "data": 'order_date' },
    { "data": 'location_id'},
    { "data": 'name' },
    { "data": 'weight' },
    { "data": 'status' }
  ],
  createdRow: function(row, data, dataIndex) {
    $(row).attr('order-id', data.order_id);
  },

  initComplete: function(){
    data = totalTable.ajax.json().data;
  }
};

const customerFinishedTableConfig = {
  paging: false,
  dom: domPlacements,
  columnDefs: [
    { orderable: false, "targets": 4 },
    { orderable: false, "targets": 5 },
    {
      targets: 5,
      data: null,
      defaultContent: `<div class="button-container d-flex justify-content-center">
                            <button type="button" class="btn-secondary mx-1 opbtn" data-target="#modal-customer-finished" onclick="viewFinishedOrders(this)">
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
    { "data": 'order_date' },
    { "data": 'location_id'},
    { "data": 'name' },
    { "data": 'weight' },
    { "data": 'status' }
  ],

  createdRow: function(row, data, dataIndex) {
    $(row).attr('order-id', data.order_id);
  },

  initComplete: function(){
    data = totalTable.ajax.json().data;
  }
};

const customerTotalTableConfig = {
  paging: false,
  dom: domPlacements,
  columnDefs: [
    { orderable: false, "targets": 4 },
    {
      targets: 4,
      data: null,
      defaultContent: `<div class="button-container d-flex justify-content-center">
                            <button type="button" class="btn-secondary mx-1 opbtn" data-target="#modal-customer-total" onclick="viewTotalOrders(this)">
                                View Order
                            </button>
                            </div>`
    }
  ],
  //alternatively you can use the syntax-->>>  ajax: " url 'customer:customer_dashboard' ",
  ajax: {
    url: getTotalOrdersUrl,
    data: "data",
  },
  //matches the data to appropriate column
  columns: [
    { "data": 'order_date'},
    { "data": 'name' },
    { "data": 'weight' },
    { "data": 'status' },
  ],

  //Adds data-id attribute to each row
  createdRow: function(row, data, dataIndex) {
    $(row).attr('order-id', data.order_id);
  },

  initComplete: function(){
    data = totalTable.ajax.json().data;
  }
};

function viewReservedOrders(button){
  selectedOrderID = button.parentNode.parentNode.parentNode.getAttribute("order-id");
  let order = null;
  for(let i = 0; i < data.length; i++){
    if(data[i].order_id == selectedOrderID){
      order = data[i];
      break;
    }
  }

  document.getElementById('date-ordered-reserved').innerHTML = String(order.order_date);
  document.getElementById('date-approved-reserved').innerHTML = String(order.date_approved);
  document.getElementById('date-reserved-reserved').innerHTML = String(order.date_reserved);
  document.getElementById('status-reserved').innerHTML = String(order.status);
  document.getElementById('crop-name-reserved').innerHTML = String(order.name);
  document.getElementById('demand-reserved').innerHTML = String(order.weight) + " kilos";
  document.getElementById('location-reserved').innerHTML = String(order.location_id);
  $("#modal-customer-reserved").modal("show")
}

function viewFinishedOrders(button){
  selectedOrderID = button.parentNode.parentNode.parentNode.getAttribute("order-id");
  let order = null;
  for(let i = 0; i < data.length; i++){
    if(data[i].order_id == selectedOrderID){
      order = data[i];
      break;
    }
  }
  console.log(order);
  document.getElementById('date-ordered-finished').innerHTML = String(order.order_date);
  document.getElementById('date-approved-finished').innerHTML = String(order.date_approved);
  document.getElementById('date-reserved-finished').innerHTML = String(order.date_reserved);
  document.getElementById('status-finished').innerHTML = String(order.status);
  document.getElementById('crop-name-finished').innerHTML = String(order.name);
  document.getElementById('demand-finished').innerHTML = String(order.weight) + " kilos";
  document.getElementById('location-finished').innerHTML = String(order.location_id);
  $("#modal-customer-finished").modal("show");
}

function viewTotalOrders(button){
  selectedOrderID = button.parentNode.parentNode.parentNode.getAttribute("order-id");
  let order = null;
  for(let i = 0; i < data.length; i++){
    if(data[i].order_id == selectedOrderID){
      order = data[i];
      break;
    }
  }

  console.log(order.order_date);

  document.getElementById('date-ordered').innerHTML = order.order_date;
  document.getElementById('date-approved').innerHTML = String(order.date_approved);
  document.getElementById('date-reserved').innerHTML = String(order.date_reserved);
  document.getElementById('status').innerHTML = String(order.status);
  document.getElementById('crop-name').innerHTML = String(order.name);
  document.getElementById('demand').innerHTML = String(order.weight) + " kilos";
  document.getElementById('location').innerHTML = String(order.location_id);
  $("#modal-customer-total").modal("show");

}


// Reserve button
// function reserveOrder(orderId) {
//   //Make sure to enclose this to a form where a csrftoken is present
//   //document.getElementById("form-id")
//   const form = null;
//   let formData = new FormData(form);//.append('action','add');
//   formData.append('order_id', orderId);
//   $.ajax({
//     url: '',
//     type: 'post',
//     //data to be passed to django view
//     data: formData,
//     contentType: false,
//     processData: false,
//     //when successful, change the data in table with new data from server
//     success: function (response) {
//       console.log('success');
//     },
//     error: function (response) {
//       console.log('fail');
//     }
//   });
// }
var totalTable = null;
var finishedTable = null;
var reservedTable = null;
//Executing it all
$(document).ready(function () {
  totalTable = $('.customer-total-table').DataTable(customerTotalTableConfig);
  finishedTable = $('.customer-finished-table').DataTable(customerFinishedTableConfig);
  reservedTable = $('.customer-reserved-table').DataTable(customerReservedTableConfig);
});
