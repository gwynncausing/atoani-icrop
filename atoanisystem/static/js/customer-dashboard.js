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
const customerTotalTableConfig = {
  paging: false,
  dom: domPlacements,
  columnDefs: [
    { orderable: false, "targets": 4 },
    {
      targets: 4,
      data: null,
      defaultContent: `<div class="button-container d-flex justify-content-center">
                            <button type="button" class="btn-secondary mx-1 opbtn" onclick="">
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
    { "data": 'crop_type' },
    { "data": 'demand' },
    { "data": 'land_area' },
    { "data": 'order_location' },
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
    {
      targets: 4,
      data: null,
      defaultContent: `<div class="button-container d-flex justify-content-center">
                            <button type="button" class="btn-secondary mx-1 opbtn" onclick="">
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
    { "data": 'crop_type' },
    { "data": 'demand' },
    { "data": 'land_area' },
    { "data": 'order_location' },
  ],
  //Adds data-id attribute to each row
  // createdRow: function(row, data, dataIndex) {
  //     $(row).attr('data-id', data.id);
  // },
};

const customerReservedTableConfig = {
  paging: false,
  dom: domPlacements,
  columnDefs: [
    { orderable: false, "targets": 4 },
    {
      targets: 4,
      data: null,
      defaultContent: `<div class="button-container d-flex justify-content-center">
                            <button type="button" class="btn-secondary mx-1 opbtn" onclick="">
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
    { "data": 'crop_type' },
    { "data": 'demand' },
    { "data": 'land_area' },
    { "data": 'order_location' },
  ],
  //Adds data-id attribute to each row
  // createdRow: function(row, data, dataIndex) {
  //     $(row).attr('data-id', data.id);
  // },
};

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
