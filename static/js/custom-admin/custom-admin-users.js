let tableData = null;
let csrf_token = null;
let selectedUserID = -1;

function setCSRFToken(csrf) {
  csrf_token = csrf
}

//ajax urls

const getAllUsersURL = '/admin/get-all-users/';
const getUnapprovedUsersURL = '/admin/get-unapproved-users/';
const getFarmersURL = '/admin/get-farmers/';
const getCustomersURL = '/admin/get-customers/';

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

const usersTableConfig = {
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
      targets: 6,
      data: null,
      defaultContent: `<div class="button-container d-flex justify-content-center">
                            <button type="button" class="view-order-btn outline-none border-0 bg-transparent mx-1 opbtn" onclick="viewUser(this)">
                                View Details
                            </button>
                            </div>`
    }
  ],
  ajax: {
    url: getAllUsersURL,
    data: "data",
  },
  //matches the data to appropriate column
  columns: [
    { "data": 'user_id' },
    { "data": 'username' },
    { "data": 'name' },
    { "data": 'email', "defaultContent": "<i>Not set</i>" },
    { "data": 'contact_number', "defaultContent": "<i>Not set</i>" },
    { "data": 'location' },
  ],
  createdRow: function (row, data, dataIndex) {
    $(row).attr('user-id', data.user_id);
  },
  initComplete: function () {
    tableData = usersTable.ajax.json().data;
  }
};

function viewUser(button) {
  selectedUserID = button.parentNode.parentNode.parentNode.getAttribute("user-id");
  let user = null;
  for (let i = 0; i < tableData.length; i++) {
    if (tableData[i].user_id == selectedUserID) {
      user = tableData[i];
      break;
    }
  }
  document.getElementById('user-id').innerHTML = String(user.user_id);
  document.getElementById('name').innerHTML = user.name;
  document.getElementById('username').innerHTML = user.username;
  document.getElementById('email').innerHTML = user.email;
  document.getElementById('contact-number').innerHTML = user.contact_number;
  document.getElementById('address').innerHTML = user.location;
  document.getElementById('status').innerHTML = user.is_approved;
  document.getElementById('land-area').innerHTML = user.land_area || "N/A";
  document.getElementById('username-password-reset').innerHTML = user.username;
  if (user.is_approved) {
    hideElement(approveBtn);
    showElement(unapproveBtn);
  }
  else {
    showElement(approveBtn);
    hideElement(unapproveBtn);
  }
  showElement(resetPasswordBtn);
  scrollToTop();
  // document.getElementById('date-ordered').innerHTML = String(user.order_date) || "N/A";
}

//https://stackoverflow.com/questions/15935318/smooth-scroll-to-top
function scrollToTop() {
  let currentOffset = window.pageYOffset;
  const arr = [];

  for (let i = 100; i >= 0; i--) {
    arr.push(new Promise(res => {
      setTimeout(() => {
        res(currentOffset * (i / 100));
      },
        2 * (100 - i))
    })
    );
  }

  arr.reduce((acc, curr, index, arr) => {
    return acc.then((res) => {
      if (typeof res === 'number')
        window.scrollTo(0, res)
      return curr
    })
  }, Promise.resolve(currentOffset)).then(() => {
    window.scrollTo(0, 0)
  })
}


function resetViewOrder() {
  selectedUserID = -1;
  document.getElementById('user-id').innerHTML = "-";
  document.getElementById('name').innerHTML = "-";
  document.getElementById('username').innerHTML = "-";
  document.getElementById('email').innerHTML = "-";
  document.getElementById('contact-number').innerHTML = "-";
  document.getElementById('address').innerHTML = "-";
  document.getElementById('status').innerHTML = "-";
  document.getElementById('land-area').innerHTML = "-";
}

function processOrder(userID, viewURL, operation) {
  let formData = new FormData();//.append('action','add');
  formData.append('user-id', userID);
  formData.append('operation', operation);
  formData.append('csrfmiddlewaretoken', csrf_token);
  $.ajax({
    url: viewURL,
    type: 'post',
    //data to be passed to django view
    data: formData,
    contentType: false,
    processData: false,
    success: function (response) {
      alert("Request processed successfully");
      usersTable.ajax.reload(() => { tableData = usersTable.ajax.json().data; }, true);
      resetViewOrder();
      hideElement(approveBtn);
      hideElement(unapproveBtn);
      hideElement(resetPasswordBtn);
      selectedUserID = -1;
    },
    error: function (response) {
      alert("Something went wrong in the server");
    }
  });
}

function showElement(e) {
  e.style.display = "block";
}

function hideElement(e) {
  e.style.display = "none";
}

function getDataFromServer(url) {
  usersTable.ajax.url(url).load(() => { tableData = usersTable.ajax.json().data; }, true);
}

let usersTable = null;

const allBtn = document.getElementById("allBtn");
const waitlistBtn = document.getElementById("waitlistBtn");
const farmersBtn = document.getElementById("farmersBtn");
const customersBtn = document.getElementById("customersBtn");

const approveBtn = document.getElementById("approveBtn");
const unapproveBtn = document.getElementById("unapproveBtn");
const resetPasswordBtn = document.getElementById("resetPasswordBtn");
const confirmResetBtn = document.getElementById("confirmResetBtn");

const labelTop = document.getElementById("labelTop");

function initializeButtons() {
  allBtn.addEventListener("click", e => {
    labelTop.innerHTML = "All";
    resetViewOrder();
    hideElement(approveBtn);
    hideElement(unapproveBtn);
    hideElement(resetPasswordBtn);
    getDataFromServer(getAllUsersURL);
  });
  waitlistBtn.addEventListener("click", e => {
    labelTop.innerHTML = "Pending";
    resetViewOrder();
    hideElement(approveBtn);
    hideElement(unapproveBtn);
    hideElement(resetPasswordBtn);
    getDataFromServer(getUnapprovedUsersURL);
  });
  farmersBtn.addEventListener("click", e => {
    labelTop.innerHTML = "Farmer";
    resetViewOrder();
    hideElement(approveBtn);
    hideElement(unapproveBtn);
    hideElement(resetPasswordBtn);
    getDataFromServer(getFarmersURL);
  });
  customersBtn.addEventListener("click", e => {
    labelTop.innerHTML = "Customer";
    resetViewOrder();
    hideElement(approveBtn);
    hideElement(unapproveBtn);
    hideElement(resetPasswordBtn);
    getDataFromServer(getCustomersURL);
  });

  approveBtn.addEventListener("click", e => {
    if (selectedUserID != -1)
      processOrder(selectedUserID, getAllUsersURL, 'approve');
    else
      alert("Select an order first.");
  });
  unapproveBtn.addEventListener("click", e => {
    if (selectedUserID != -1)
      processOrder(selectedUserID, getAllUsersURL, 'unapprove');
    else
      alert("Select an order first.");
  });
  confirmResetBtn.addEventListener("click", e => {
    if (selectedUserID != -1)
      processOrder(selectedUserID, getAllUsersURL, 'reset-password');
    else
      alert("Select an order first.");
  });

}

function initialize() {
  usersTable = $('.users-table').DataTable(usersTableConfig);
  hideElement(approveBtn);
  hideElement(unapproveBtn);
  hideElement(resetPasswordBtn);
  initializeButtons();
}


