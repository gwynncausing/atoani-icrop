//ajax urls
const getIncomingOrdersUrl = '/dashboard/get-farmer-incoming-orders';
const getReservedOrdersUrl = '/dashboard/get-farmer-reserved-orders';
const getFinishedOrdersUrl = '/dashboard/get-farmer-finished-orders';

let data = null;


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
                            <button type="button" class="btn-primary mx-1 btnreserve" onclick="">
                                Reserve
                            </button>
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

function viewOrders(button){
  selectedOrderID = button.parentNode.parentNode.parentNode.getAttribute("order-id");
  let order = null;
  for(let i = 0; i < data.length; i++){
    if(data[i].order_id == selectedOrderID){
      order = data[i];
      break;
    }
  }

  console.log(order);
  document.getElementById('date-ordered').innerHTML = String(order.order_id);
  document.getElementById('date-approved').innerHTML = String(order.date_approved);
  document.getElementById('date-reserved').innerHTML = String(order.date_reserved);
  document.getElementById('status').innerHTML = String(order.status);
  document.getElementById('date-ordered').innerHTML = String(order.order_id);
  document.getElementById('crop-name').innerHTML = String(order.name);
  document.getElementById('demand').innerHTML = String(order.weight) + " kilos";
  document.getElementById('location').innerHTML = String(order.location_id);
  document.getElementById('area-needed').innerHTML = String(order.land_area_needed);
  document.getElementById('days').innerHTML = String(order.weight);
  $("#modal-farmer").modal("show");

}

//Reserve button
function reserveOrder(orderId) {
  //Make sure to enclose this to a form where a csrftoken is present
  //document.getElementById("form-id")
  const form = null;
  let formData = new FormData(form);//.append('action','add');
  formData.append('order_id', orderId);
  $.ajax({
    url: '',
    type: 'post',
    //data to be passed to django view
    data: formData,
    contentType: false,
    processData: false,
    //when successful, change the data in table with new data from server
    success: function (response) {
      console.log('success');
    },
    error: function (response) {
      console.log('fail');
    }
  });
}

var incomingTable = null;
var finishedTable = null;
var reservedTable = null;

//Executing it all
$(document).ready(function () {
  incomingTable = $('.farmer-incoming-table').DataTable(farmerIncomingTableConfig);
  finishTable = $('.farmer-finished-table').DataTable(farmerFinishedTableConfig);
  reservedTable = $('.farmer-reserved-table').DataTable(farmerReservedTableConfig);
});
