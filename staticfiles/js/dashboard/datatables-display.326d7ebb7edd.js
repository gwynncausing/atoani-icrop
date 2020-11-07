//used make the datatables parent parent to be inline
//for better mobile view
/*
const datatablesDisplay = table => {
   const show = e => {
       table.parentNode.parentNode.style.display = "block"
       console.log(table.parentNode.parentNode)
       console.log("Done loading the server")
   };
   //make sure everything is fully loaded including the datatables api
   //so that the parent node will reflect on the actual html structure on the browser
   window.addEventListener("load", show);
};
*/

const customerDatatablesDisplay = () => {
    const hideTab = (tab) => tab.display = "none";
    const showTab = (tab) => tab.display = "inline";

    const navPendingTab = document.querySelector("#nav-pending-tab");
    const navReservedTab = document.querySelector("#nav-reserved-tab");
    const navFinishdedTab = document.querySelector("#nav-finished-tab");
    const pendingTab = document.querySelector("#pending-table");
    const reservedTab = document.querySelector("#reserved-table");
    const finishdedTab = document.querySelector("#finished-table");

    const showPendingTable = e => {
        showTab(pendingTab);
        hideTab(reservedTab);
        hideTab(finishdedTab);
        console.log("hello2");
    }

    const showReservedTable = e => {
        showTab(reservedTab);
        hideTab(pendingTab);
        hideTab(finishdedTab);
        console.log("hello3");
    }


    const showFinishedTable = e => {
        showTab(finishdedTab);
        hideTab(pendingTab);
        hideTab(reservedTab);
        console.log("hello4");
    }

    const initTables = () => {
        hideTab(reservedTab);
        hideTab(finishdedTab);
        console.log("hello5");
    }

    navPendingTab.addEventListener("click", showPendingTable);
    navReservedTab.addEventListener("click", showReservedTable);
    navFinishdedTab.addEventListener("click", showFinishedTable);
    initTables();
}

const farmerDatatablesDisplay = () => {
    const hideTab = (tab) => tab.display = "none";
    const showTab = (tab) => tab.display = "inline";

    const navIncomingTab = document.querySelector("#nav-incoming-tab");
    const navReservedTab = document.querySelector("#nav-reserved-tab");
    const navFinishdedTab = document.querySelector("#nav-finished-tab");
    const incomingTab = document.querySelector("#incoming-table");
    const reservedTab = document.querySelector("#reserved-table");
    const finishdedTab = document.querySelector("#finished-table");

    const showIncomingTable = e => {
        showTab(incomingTab);
        hideTab(reservedTab);
        hideTab(finishdedTab);
        console.log("hello2");
    }

    const showReservedTable = e => {
        showTab(reservedTab);
        hideTab(incomingTab);
        hideTab(finishdedTab);
        console.log("hello3");
    }


    const showFinishedTable = e => {
        showTab(finishdedTab);
        hideTab(incomingTab);
        hideTab(reservedTab);
        console.log("hello4");
    }

    const initTables = () => {
        hideTab(reservedTab);
        hideTab(finishdedTab);
        console.log("hello5");
    }

    navIncomingTab.addEventListener("click", showIncomingTable);
    navReservedTab.addEventListener("click", showReservedTable);
    navFinishdedTab.addEventListener("click", showFinishedTable);
    initTables();
}

