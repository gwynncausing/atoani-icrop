//used make the datatables parent parent to be inline
//for better mobile view
const datatablesDisplay = table => {
   const show = e => {
       table.parentNode.parentNode.style.display = "inline"
   };
   //make sure everything is fully loaded including the datatables api
   //so that the parent node will reflect on the actual html structure on the browser
   window.addEventListener("load", show);
};
