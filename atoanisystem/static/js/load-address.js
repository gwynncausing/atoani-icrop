function titleCase(str) {
  var splitStr = str.toLowerCase().split(" ");
  for (var i = 0; i < splitStr.length; i++) {
      // You do not need to check if i is larger than splitStr length, as your for does that for you
      // Assign it back to the array
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  // Directly return the joined string
  return uppercaseParenthesis(splitStr.join(' '));
}
function uppercaseParenthesis(str){
  let openingParenthesis = str.indexOf("(");
  if(openingParenthesis!=-1){
      return str.replace(str[openingParenthesis+1],str[openingParenthesis+1].toUpperCase());
  }
  return str;
}
//loading data to the select tags based on ID of tag, data here is a list/array
function loadSelectData(id, data) {
  data.sort();
  for (var i = 0; i < data.length; i++) {
      $('#' + id).append($("<option></option>")
      .attr("value", (data[i]+''))
      .text(titleCase(data[i]+'')));
      //console.log('the type is' + typeof(data[i]));
  }
}

//loads the cities/municipalities from json file
function loadCity() {
  //take note of the json file structure for philippines addresses
  //directly get the provinces since there is no region select tag/dropdown
  for (region in phAddress) {
      //region here is the key(e.g 4A, 01, NCR), which will be used to get the province_list json object that is nested in the region json (refer to json file)
      for (province in phAddress[region].province_list) {
          //check if the key in province_list of that region matches the selected province in dropdown menu
          if ($("#province option:selected").text().toLowerCase() == province.toLowerCase()) {
              //set municipalities variable to the matching province to extract the municipalities/cities nestedin the province_list json
              municipalities = phAddress[region].province_list[province];
          }
      }
  }
  //resets the select tag or else it will just be added to existing options
  $('#city').empty();
  //loads the municipality_list which is an array of keys (refer to json file)
  loadSelectData('city', Object.keys(municipalities.municipality_list));
}
//loads the barangays from json file, the same logic with loadCity() function
function loadBarangay() {
  let selected = $("#city option:selected").text();
  for (municipality in municipalities.municipality_list) {
      if (selected.toLowerCase() == municipality.toLowerCase()) {
          barangays = municipalities.municipality_list[municipality];
      }
  }
  $('#barangay').empty();
  loadSelectData('barangay', barangays.barangay_list);
}

//update cities and barangay select tags when province selection is changed, same logic with loadCity() function
let municipalities = {};
$('#province').change(function () {
  for (region in phAddress) {
      //console.log(phAddress[region].province_list);
      for (province in phAddress[region].province_list) {
          if ($("#province option:selected").text().toLowerCase() == province.toLowerCase()) {
              municipalities = phAddress[region].province_list[province];
          }
      }
  }
  $('#city').empty();
  $('#barangay').empty();
  loadSelectData('city', Object.keys(municipalities.municipality_list));
  loadCity();
  loadBarangay();
});

//update barangay select tag when cities selection is changed
let barangays = {};
$('#city').change(function() {
  let selected = $("#city option:selected").text();
  for (municipality in municipalities.municipality_list) {
      if (selected.toLowerCase() == municipality.toLowerCase()) {
          barangays = municipalities.municipality_list[municipality];
      }
  }
  console.log(barangays);
  $('#barangay').empty();
  loadSelectData('barangay', barangays.barangay_list);
});


let phAddress = {};
//address url comes from django, therefore is using underscore (_) instead of camelCase
function loadAddresses(address_url){
  //getJSON is an ajax call to fetch the json content
  $.getJSON(address_url, function(data) {
      //assigns the data to ph address, to be used by other functions like loadCity()
      phAddress = data;
      //traversing the region and getting the province list as an array using Objects.keys then adding it to the dropdown for provinces
      $.each(data, function(key, value) {
          var provinces = Object.keys(value.province_list)
          loadSelectData('province', provinces);
      });
      var sortedOptions = $("#province option").sort(function (a,b) { return a.value.toUpperCase().localeCompare(b.value.toUpperCase()) });
      $("#province").empty();
      $("#province").append(sortedOptions);
      loadCity();
      loadBarangay();
  });
}
