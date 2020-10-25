
$(document).ready(function(){
    $(".btn-save-name").click(function(){
        $.ajax({
            url: '/settings/',
            type: 'GET',
            data: {
                'btnText': $(this).text()
            },
            sucess: function(response){
                // $(".btn").text("HELLO")
                console.log("clicked");
            }
        });
    });
});