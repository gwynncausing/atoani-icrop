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
                            <button type="button" class="btn-secondary mx-1 opbtn" onclick="openModal()">
                                View Order
                            </button>
                            </div>`
    }
  ],
  //alternatively you can use the syntax-->>>  ajax: " url 'customer:customer_dashboard' ",
  ajax: {
    url: getReservedOrdersUrl,
    dataSrc: "data"
  },
  //matches the data to appropriate column
  columns: [
    { "data": 'order_date' },
    { "data": 'location_id'},
    { "data": 'name' },
    { "data": 'weight' },
    { "data": 'status' },
  ],
  //Adds data-id attribute to each row
  // createdRow: function(row, data, dataIndex) {
  //     $(row).attr('data-id', data.id);
  // },
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
                            <button type="button" class="btn-secondary mx-1 opbtn" onclick="openModal()">
                                View Order
                            </button>
                      </div>`
    }
  ],
  //alternatively you can use the syntax-->>>  ajax: " url 'customer:customer_dashboard' ",
  ajax: {
    url: getFinishedOrdersUrl,
    dataSrc: "data"
  },
  //matches the data to appropriate column
  columns: [
    { "data": 'order_date' },
    { "data": 'location_id'},
    { "data": 'name' },
    { "data": 'weight' },
    { "data": 'status' },
  ],
  //Adds data-id attribute to each row
  // createdRow: function(row, data, dataIndex) {
  //     $(row).attr('data-id', data.id);
  // },
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
                            <button type="button" class="btn-secondary mx-1 opbtn" onclick="openModal()">
                                View Order
                            </button>
                            </div>`
    }
  ],
  //alternatively you can use the syntax-->>>  ajax: " url 'customer:customer_dashboard' ",
  ajax: {
    url: getTotalOrdersUrl,
    dataSrc: "data"
  },
  //matches the data to appropriate column
  columns: [
    { "data": 'order_date' },
    { "data": 'name' },
    { "data": 'weight' },
    { "data": 'status' },
    { "render": function(row) 
      {return '<button class="btn-secondary mx-1 opbtn" data-toggle="modal" data-id="'+row.order_pair_id+'" data-name="'+row.name+'" data-demand="'+row.weight+'" data-location="'+row.location+'" data-date-ordered="'+row.order_date+'" data-status="'+row.status+'" data-date-approved="'+row.date_approved+'" data-date-reserved="'+row.date_reserved+'" data-order-id="'+row.order_id+'" data-target="#modal-customer" onClick="'+showObjects()+'">'+"View Order"+'</button>'} }
      // {return '<button class="btn-secondary mx-1 opbtn" data-toggle="modal" data-target="#modal-customer" onClick="'+showObjects()+'">'+"View Order"+'</button>'} }
  ],
  //Adds data-id attribute to each row
  // createdRow: function(row, data, dataIndex) {
  //     $(row).attr('data-id', data.id);
  // },
};

// $("#modal-customer").on('show.bs.modal', function () {
//   var id = $('#modal-customer').data('id');
//   console.log(id);
//   data-myjson="{'foo':false,'baz':'hello'}"
// });

$("#modal-customer").on('show.bs.modal', function (e) {
  var triggerLink = $(e.relatedTarget);
  $(this).find('.modal-body #date-ordered').text(triggerLink.data("date-ordered"));
  $(this).find('.modal-body #status').text(triggerLink.data("status"));
  $(this).find('.modal-body #order-number').text(triggerLink.data("order-num"));
  $(this).find('.modal-body #date-approved').text(triggerLink.data("date-approved"));
  $(this).find('.modal-body #date-reserved').text(triggerLink.data("date-reserved"));
  $(this).find('.modal-body #crop-name').text(triggerLink.data("name"));
  $(this).find('.modal-body #demand').text(triggerLink.data("demand") + " kg");
  $(this).find('.modal-body #location').text(triggerLink.data("location"));
  $(this).find('.modal-body #order-id').text(triggerLink.data("order-id"));
});

function showObjects(){
  $.ajax({
    type: "GET",
    url: getTotalOrdersUrl,
    dataType: "json",
    data: "data",
    success: function (data) {
        console.log(data)
    }
  });
}

// function openModal(){
//   $.ajax({
//     type: "GET",
//     url: getTotalOrdersUrl,
//     dataType: "json",
//     data: "data",
//     success: function (data) {
//         console.log(data)
//         // $("#modal-customer").modal("show")
//     }
//   });
// }


//Reserve button
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

//Executing it all
$(document).ready(function () {
  $('.customer-total-table').DataTable(customerTotalTableConfig);
  $('.customer-finished-table').DataTable(customerFinishedTableConfig);
  $('.customer-reserved-table').DataTable(customerReservedTableConfig);
});
