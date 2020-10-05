(switcthTab = () => {
    const colors = ["#EBE324", "#5775DD", "#51E49F"];
    const reserved = $(".reserved-orders");
    const finished = $(".finished-orders");
    const incoming = $(".incoming-orders");
    const tab = $(".order-tab");
    
    reserved.click(e => {
        tab.css("background", colors[0]);
        tab.html("<i>Reserved Orders</i>");
    });

    finished.click(e => {
        tab.css("background", colors[1]);
        tab.html("<i>Finished Orders</i>");
    });

    incoming.click(e => {
        tab.css("background", colors[2]);
        tab.html("<i>Incoming Orders</i>");
    });
   
})()