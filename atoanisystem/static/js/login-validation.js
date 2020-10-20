let csrf_token = null;
function setCSRF(value){
	csrf_token = value;
}

let errorMessage = document.getElementById("error");
let usernameInput = document.getElementById("username");
let passwordInput = document.getElementById("password");

window.onload=function(){
	$(document).ready(function () {

		let form = document.getElementById('form-login');
		form.addEventListener('submit',function(e){
			e.preventDefault();
		});
			
		usernameInput.oninput = function() {
    	hideMessage();
		};
		
		passwordInput.oninput = function() {
    	hideMessage();
		};

		function hideMessage(){
			errorMessage.style.display = "none";
		}
		
		$('#signin').click(function(e){
			// e.preventDefault();
			let formData = new FormData(form);
			formData.append('operation', 'login');
			formData.append('csrfmiddlewaretoken',csrf_token);
			$.ajax({
				url: '',
				type: 'post',
				data: formData,
				contentType: false,
				processData: false,
				success: function(response){
						console.log("success");
						console.log(response.result);
						
						if (response.result == "farmer ok"){
							// TODO: Redirect to farmer dashboard
							console.log("farmer ok");
							// window.location = "{% url 'dashboard:farmer' %}";
						}
						else if (response.result == "customer ok"){
							// TODO: Redirect to Customer Dashboard
							console.log("customer ok");
							// window.location = "{% url 'dashboard:customer' %}";
						}
						
						else if(response.result == "admin") {
							// TODO: Redirect to Admin Page
							console.log("admin");
							window.location = 'http://127.0.0.1:8000/admin/';
						}
				},
				error: function(response){
						console.log("error here");
						console.log(response);
						console.log(response.responseJSON.result);
						if(response.responseJSON.result == "not ok"){
							if (errorMessage.style.display === "none") {
								errorMessage.style.display = "block";
								errorMessage.innerHTML = "Username or Password is incorrect"
							}
						}
						else if (response.result == "approval"){
							// TODO: Open Modal Approval
							// e.preventDefault();
							console.log("approval");
							$('#accountInReviewModal').modal('show');
						}
				}
			});
		});

	});
}