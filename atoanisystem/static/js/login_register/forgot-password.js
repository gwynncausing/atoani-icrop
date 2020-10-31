let csrf_token = null;

function setCSRFToken(csrf){
  csrf_token = csrf
}

// $("#fogotEmail").click(function(){
//     $("#forgotEmailAnswer").slideUp();
// });

function initialize(){
    // $("button[id=fogotEmail]").click(function(){
    //     console.log("hello");
    //     // $("#forgotEmailAnswer").slideUp();
    // });
    $(".btn1").click(function(){
        $("p").slideUp();
    });
}