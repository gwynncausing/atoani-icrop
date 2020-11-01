function initialize(){
    $("#btn1").click(function(){
        console.log("test");
        if($("#btn1Answer").css('display') == 'block'){
            $("#btn1Answer").slideUp();
        } else {
            $("#btn1Answer").slideDown();
        }
    });
    $("#btn2").click(function(){
        console.log("test");
        if($("#btn2Answer").css('display') == 'block'){
            $("#btn2Answer").slideUp();
        } else {
            $("#btn2Answer").slideDown();
        }
    });
}