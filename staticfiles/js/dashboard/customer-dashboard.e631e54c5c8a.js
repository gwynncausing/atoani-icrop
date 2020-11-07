let data = null;

//ajax urls
const getPendingOrdersUrl = '/dashboard/get-customer-pending-orders';
const getReservedOrdersUrl = '/dashboard/get-customer-reserved-orders';
const getFinishedOrdersUrl = '/dashboard/get-customer-finished-orders';

const atoanimessage = "<i>To Be Updated by Atoani</i>"
//data table settings
const domPlacements = `<'row'<'col-md-12 d-sm-flex pt-4'f<'ml-3'l>>>
                        <'row'<'col-sm-12'tr>>
                        <'row'<'col-sm-12 mt-2 col-md-5'i>
                      >`;

const customerReservedTableConfig = {
  paging: true,
  searching: true,
  lengthMenu: [ [-1,5, 10, 25, 50], ["All",5, 10, 25, 50] ],
  dom: domPlacements,
  columnDefs: [
    { orderable: false, "targets": 4 },
    { orderable: false, "targets": 5 },
    {
      targets: 5,
      //make the data (columns) as order_id
      //and add dynamic content
      render: function(data, row, type) {
        return  `<div class="button-container d-flex justify-content-center p-0 m-0">
                    <button type="button" class="btn-secondary opbtn" data-target="#modal-customer-reserved" onclick="viewReservedOrders('${data}')">
                        View Order
                    </button>
                  </div>`
        }
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
    { "data": 'status' },
    { "data": 'order_id'},
  ],
  order: [
    [ 1, 'asc' ]
  ],
  initComplete: function(){
    resevered_data = reservedTable.ajax.json().data;
    //show the total count of reserved orders
    $("#reserved-orders-counter").html(resevered_data.length);
  },
  responsive: true
};

const customerFinishedTableConfig = {
  paging: true,
  searching: true,
  lengthMenu: [ [-1,5, 10, 25, 50], ["All",5, 10, 25, 50] ],
  dom: domPlacements,
  columnDefs: [
    { orderable: false, "targets": 4 },
    { orderable: false, "targets": 5 },
    {
      targets: 5,
      //make the data (columns) as order_id
      //and add dynamic content
      render: function(data, type, row){
        return `<div class="button-container d-flex justify-content-center p-0 m-0">
                  <button type="button" class="btn-secondary opbtn" data-target="#modal-customer-finished" onclick="viewFinishedOrders('${data}')">
                      View Order
                  </button>
                </div>`
       }
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
    { "data": 'status' },
    { "data": 'order_id'},
  ],

  order: [
    [ 1, 'asc' ]
  ],
  initComplete: function(){
    finished_data = finishedTable.ajax.json().data;
    //show the total count of finished orders
    $("#finished-orders-counter").html(finished_data.length);
  },
  responsive: true
};

const customerPendingTableConfig = {
  paging: true,
  searching: true,
  lengthMenu: [ [-1,5, 10, 25, 50, -1], ["All",5, 10, 25, 50] ],
  dom: domPlacements,
  columnDefs: [
    { orderable: false, "targets": 4 },
    {
      targets: 4,
      //make the data (columns) as order_id
      //and add dynamic content
      render: function (data, type, row) {
        return `<div class="button-container d-flex justify-content-center p-0 m-0">
                  <button type="button" class="btn-secondary opbtn" data-target="#modal-customer-pending" onclick="viewPendingOrders('${data}')">
                    View Order
                  </button>
                </div>`
      }
    },
  ],
  //alternatively you can use the syntax-->>>  ajax: " url 'customer:customer_dashboard' ",
  ajax: {
    url: getPendingOrdersUrl,
    data: "data",
  },
  //matches the data to appropriate column
  columns: [
    { "data": 'order_date'},
    { "data": 'name' },
    { "data": 'weight' },
    { "data": 'status' },
    { "data": 'order_id'},
  ],
  order: [
    [ 1, 'asc' ]
  ],
  initComplete: function(){
    pending_data = pendingTable.ajax.json().data;
    //show the total count of orders
    $("#pending-orders-counter").html(pending_data.length);
  },
  responsive: true
};

function viewReservedOrders(selectedOrderID){
  let order = null;
  for(let i = 0; i < resevered_data.length; i++){
    if(resevered_data[i].order_id == selectedOrderID){
      order = resevered_data[i];
      break;
    }
  }
  document.getElementById('reserved-date-ordered').innerHTML = String(order.order_date);
  document.getElementById('reserved-date-approved').innerHTML = String(order.approved_date);
  document.getElementById('reserved-date-reserved').innerHTML = String(order.reserved_date);
  console.log(order);
  //document.getElementById('reserved-status').innerHTML = String(order.status);
  document.getElementById('reserved-crop-name').innerHTML = String(order.name);
  document.getElementById('reserved-demand').innerHTML = String(order.weight) + " kilos";
  document.getElementById('reserved-location').innerHTML = String(order.location_id);
  document.getElementById('reserved-order-number').innerHTML = String(order.order_pair_id);
  $("#modal-customer-reserved").modal("show")
}

function viewFinishedOrders(selectedOrderID){
  let order = null;
  console.log(selectedOrderID);
  for(let i = 0; i < finished_data.length; i++){
    if(finished_data[i].order_id == selectedOrderID){
      order = finished_data[i];
      break;
    }
  }
  //console.log(JSON.stringify(order));
  document.getElementById('finished-date-ordered').innerHTML = String(order.order_date);
  document.getElementById('finished-date-approved').innerHTML = String(order.approved_date);
  document.getElementById('finished-date-reserved').innerHTML = String(order.reserved_date);
  document.getElementById('finished-date-collected').innerHTML = String(order.collected_date);
  document.getElementById('finished-date-harvested').innerHTML = String(order.harvested_date);
  document.getElementById('finished-crop-name').innerHTML = String(order.name);
  document.getElementById('finished-demand').innerHTML = String(order.weight) + " kilos";
  document.getElementById('finished-location').innerHTML = String(order.location_id);
  document.getElementById('finished-order-number').innerHTML = String(order.order_pair_id);

  //reset the modal
  document.querySelector(".finished-date-harvested p").classList.remove("label");
  document.querySelector(".finished-date-collected").classList.add("d-none");

  if(String(order.status) == "Delivered"){
    document.querySelector(".finished-date-collected").classList.remove("d-none");
    document.querySelector(".finished-date-collected p").classList.add("label");
  }
  else
    document.querySelector(".finished-date-harvested p").classList.add("label");

  $("#modal-customer-finished").modal("show");
}

function viewPendingOrders(selectedOrderID){
  let order = null;
  for(let i = 0; i < pending_data.length; i++){
    if(pending_data[i].order_id == selectedOrderID){
      order = pending_data[i];
      break;
    }
  }
  //console.log(button)
  //console.log(pending_data)
  //console.log(JSON.stringify(order));

  document.getElementById('pending-date-ordered').innerHTML = order.order_date;
  document.getElementById('pending-date-approved').innerHTML = order.order_date;
  document.getElementById('pending-crop-name').innerHTML = String(order.name);
  document.getElementById('pending-demand').innerHTML = String(order.weight) + " kilos";
  document.getElementById('pending-location').innerHTML = String(order.location_id);
  document.getElementById('pending-order-number').innerHTML = String(order.order_pair_id);

  //reset the status
  document.querySelector('.pending-date-ordered p').classList.remove("label");
  document.querySelector('.pending-date-approved p').classList.remove("label");
  document.querySelector('.pending-date-approved').classList.add("d-none");
  document.querySelector('.pending-date-ordered').classList.add("d-none");

  document.querySelector('.pending-date-ordered').classList.remove("d-none");
  if(String(order.status) == "Posted"){
    document.querySelector('.pending-date-approved').classList.remove("d-none");
    document.querySelector('.pending-date-approved p').classList.add("label");
  }
  else
    document.querySelector('.pending-date-ordered p').classList.add("label");

  $("#modal-customer-pending").modal("show");

}

var pendingTable = null;
var finishedTable = null;
var reservedTable = null;


var reservedCount = null;
var finsihedCount = null;
var totalCount = null;

//Executing it all
$(document).ready(function () {
  
  pendingTable = $('.customer-pending-table').DataTable(customerPendingTableConfig);
  finishedTable = $('.customer-finished-table').DataTable(customerFinishedTableConfig);
  reservedTable = $('.customer-reserved-table').DataTable(customerReservedTableConfig);

  /*Date Range Filter*/
  let table = pendingTable;
  const pendingTab = $("#nav-pending-tab");
  const reservedTab = $("#nav-reserved-tab");
  const finishedTab = $("#nav-finished-tab");

  $.fn.dataTable.ext.search.push((settings, data, dataIndex ) => {
      let minDate = null;
      let maxDate = null;
      let path = null;
      const date = data[0];
      const id =  settings.nTable.getAttribute('id')
      
      if(id == "finished-table-orders")
        path = "#finished-table";
      else if(id == "reserved-table-orders")
        path = "#reserved-table";
      else
        path = "#pending-table";
      
      //console.log(path)
      minDate = $(path).find('.min-date').val();
      maxDate = $(path).find('.max-date').val();
    
      if (minDate === '' || maxDate === '' )
        return true;
      if (Date.parse(date) >= Date.parse(minDate) && Date.parse(date) <= Date.parse(maxDate))
        return true;  
      else 
        return false;
    }
  );

  pendingTab.click(() => table = pendingTable );
  reservedTab.click(() => table = reservedTable );
  finishedTab.click(() => table = finishedTable );

  $('.min-date, .max-date').keyup(() => table.draw());
  $('.min-date, .max-date').change(() => table.draw());

  const clear = () => {
    $('.min-date').val("");
    $('.max-date').val("");
    table.draw();
  }

  $("#pending-table").find('#refresh-btn').click(clear);
  $("#reserved-table").find('#refresh-btn').click(clear);
  $("#finished-table").find('#refresh-btn').click(clear);

});

//https://www.gyrocode.com/articles/jquery-datatables-column-width-issues-with-bootstrap-tabs/#example2
//code below to recalculate column widths of all visible tables once a tab becomes active by using a combination of columns.adjust() and responsive.recalc() API methods

$('a[data-toggle="tab"]').on('shown.bs.tab', function(e){
  $($.fn.dataTable.tables(true)).DataTable()
     .columns.adjust()
     //.responsive.recalc();
});


