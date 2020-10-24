let data = null;

//ajax urls
const getTotalOrdersUrl = '/dashboard/get-customer-total-orders';
const getReservedOrdersUrl = '/dashboard/get-customer-reserved-orders';
const getFinishedOrdersUrl = '/dashboard/get-customer-finished-orders';

//data table settings
const domPlacements = `<
                        <"d-flex float-left ml-md-5 ml-sm-2 ml-1 mb-3 mt-4"
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
    { "data": 'name' },
    { "data": 'location_id'},
    { "data": 'weight' },
    { "data": 'status' }
  ],

  order: [
    [ 1, 'asc' ]
  ],

  createdRow: function(row, data, dataIndex) {
    $(row).attr('order-id', data.order_id);
  },

  initComplete: function(){
    resevered_data = reservedTable.ajax.json().data;
    //show the total count of reserved orders
    $("#reserved-orders-counter").html(resevered_data.length);
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
    { "data": 'name' },
    { "data": 'location_id'},
    { "data": 'weight' },
    { "data": 'status' }
  ],

  order: [
    [ 1, 'asc' ]
  ],

  createdRow: function(row, data, dataIndex) {
    $(row).attr('order-id', data.order_id);
  },

  initComplete: function(){
    finished_data = finishedTable.ajax.json().data;
    //show the total count of finished orders
    $("#finished-orders-counter").html(finished_data.length);
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

  order: [
    [ 1, 'asc' ]
  ],

  //Adds data-id attribute to each row
  createdRow: function(row, data, dataIndex) {
    $(row).attr('order-id', data.order_id);
  },

  initComplete: function(){
    total_data = totalTable.ajax.json().data;
    //show the total count of orders
    $("#total-orders-counter").html(total_data.length);
  }
};

function viewReservedOrders(button){
  selectedOrderID = button.parentNode.parentNode.parentNode.getAttribute("order-id");
  let order = null;
  for(let i = 0; i < resevered_data.length; i++){
    if(resevered_data[i].order_id == selectedOrderID){
      order = resevered_data[i];
      break;
    }
  }
  document.getElementById('reserved-date-ordered').innerHTML = String(order.order_date);
  document.getElementById('reserved-date-approved').innerHTML = String("wala sa JSON");
  document.getElementById('reserved-date-reserved').innerHTML = String("wala sa JSON");
  document.getElementById('reserved-status').innerHTML = String(order.status);
  document.getElementById('reserved-crop-name').innerHTML = String(order.name);
  document.getElementById('reserved-demand').innerHTML = String(order.weight) + " kilos";
  document.getElementById('reserved-location').innerHTML = String(order.location_id);
  document.getElementById('reserved-order-number').innerHTML = String(order.order_pair_id);
  $("#modal-customer-reserved").modal("show")
}

function viewFinishedOrders(button){
  selectedOrderID = button.parentNode.parentNode.parentNode.getAttribute("order-id");
  let order = null;
  console.log(selectedOrderID);
  for(let i = 0; i < finished_data.length; i++){
    if(finished_data[i].order_id == selectedOrderID){
      order = finished_data[i];
      break;
    }
  }
  console.log(JSON.stringify(order));
  document.getElementById('finished-date-ordered').innerHTML = String(order.order_date);
  document.getElementById('finished-date-approved').innerHTML = String("wala sa JSON");
  document.getElementById('finished-date-reserved').innerHTML = String("wala sa JSON");
  document.getElementById('finished-date-finished').innerHTML = String("wala sa JSON");
  document.getElementById('finished-status').innerHTML = String(order.status);
  document.getElementById('finished-crop-name').innerHTML = String(order.name);
  document.getElementById('finished-demand').innerHTML = String(order.weight) + " kilos";
  document.getElementById('finished-location').innerHTML = String(order.location_id);
  document.getElementById('finished-order-number').innerHTML = String(order.order_pair_id);
  $("#modal-customer-finished").modal("show");
}

function viewTotalOrders(button){
  selectedOrderID = button.parentNode.parentNode.parentNode.getAttribute("order-id");
  let order = null;
  for(let i = 0; i < total_data.length; i++){
    if(total_data[i].order_id == selectedOrderID){
      order = total_data[i];
      break;
    }
  }

  console.log(JSON.stringify(order));

  document.getElementById('total-date-ordered').innerHTML = order.order_date;
  document.getElementById('total-date-approved').innerHTML = String("wala sa JSON");
  document.getElementById('total-date-reserved').innerHTML = String("wala sa JSON");
  document.getElementById('total-date-finished').innerHTML = String("wala sa JSON");
  document.getElementById('total-status').innerHTML = String(order.status);
  document.getElementById('total-crop-name').innerHTML = String(order.name);
  document.getElementById('total-demand').innerHTML = String(order.weight) + " kilos";
  document.getElementById('total-location').innerHTML = String(order.location_id);
  document.getElementById('total-order-number').innerHTML = String(order.order_pair_id);

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


var reservedCount = null;
var finsihedCount = null;
var totalCount = null;

//Executing it all
$(document).ready(function () {
  totalTable = $('.customer-total-table').DataTable(customerTotalTableConfig);
  finishedTable = $('.customer-finished-table').DataTable(customerFinishedTableConfig);
  reservedTable = $('.customer-reserved-table').DataTable(customerReservedTableConfig);
  
});

//https://www.gyrocode.com/articles/jquery-datatables-column-width-issues-with-bootstrap-tabs/#example2
//code below to recalculate column widths of all visible tables once a tab becomes active by using a combination of columns.adjust() and responsive.recalc() API methods
$('a[data-toggle="tab"]').on('shown.bs.tab', function(e){
  $($.fn.dataTable.tables(true)).DataTable()
     .columns.adjust()
     .responsive.recalc();
});
