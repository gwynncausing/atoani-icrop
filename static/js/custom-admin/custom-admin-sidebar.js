// const dropdown = document.getElementsByClassName("dropdown-btn");
// var i;

// for (i = 0; i < dropdown.length; i++) {
//   dropdown[i].addEventListener("click", function() {
//     this.classList.toggle("active");
//     var dropdownContent = this.nextElementSibling;
//     if (dropdownContent.style.display === "block") {
//       dropdownContent.style.display = "none";
//     } else {
//       dropdownContent.style.display = "block";
//     }
//   });
// }

$('button[class="sidebar-nav"]').on('click', function(){
  $('button[class="sidebar-nav focussed"]').removeClass('focussed');
  $('button[class="sidebar-nav"]#'+this.id).addClass('focussed');
});
