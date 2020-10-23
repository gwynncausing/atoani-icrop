let data = null;

//ajax urls
const getTotalOrdersUrl = '/dashboard/get-customer-total-orders';

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
  // columnDefs: [
  //   { orderable: false, "targets": -1 },
  //   {
  //     targets: -1,
  //     data: null,
  //     defaultContent: `<div class="button-container d-flex justify-content-center">
  //                           <button type="button" class="btn-secondary mx-1 opbtn" data-target="#modal-customer-reserved" onclick="viewReservedOrders(this)">
  //                               View Order
  //                           </button>
  //                           </div>`
  //   }
  // ]
  //alternatively you can use the syntax-->>>  ajax: " url 'customer:customer_dashboard' ",
  // ajax: {
  //   url: getReservedOrdersUrl,
  //   data: "data",
  // },
  // //matches the data to appropriate column
  // columns: [
  //   { "data": 'order_date' },
  //   { "data": 'location_id'},
  //   { "data": 'name' },
  //   { "data": 'weight' },
  //   { "data": 'status' }
  // ],
  // createdRow: function(row, data, dataIndex) {
  //   $(row).attr('order-id', data.order_id);
  // },

  // initComplete: function(){
  //   resevered_data = reservedTable.ajax.json().data;
  // }
};
let ordersTable = null;
//Executing it all
$(document).ready(function () {
  ordersTable = $('.orders-table').DataTable(ordersTableConfig);
});
