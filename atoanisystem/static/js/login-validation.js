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
    	hideErrorMessage();
		};
		
		passwordInput.oninput = function() {
    	hideErrorMessage();
		};

		function hideErrorMessage(){
			errorMessage.style.display = "none";
		}
		$('#modalOK').click(function(){
			setTimeout("location.reload(true);",100);
		});
		
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
						if (response.result == "farmer ok"){
							// Redirect to farmer dashboard
							window.location = response.url;
						}
						else if (response.result == "customer ok"){
							// Redirect to Customer Dashboard
							window.location = response.url;
						}
						else if (response.result == "approval"){
							// Open Modal Approval
							$('#accountInReviewModal').modal('toggle');
						}
						else if(response.result == "admin") {
							// Redirect to Admin Page
							window.location = response.url;
						}
				},
				error: function(response){
						if(response.responseJSON.result === "not ok"){
							if (errorMessage.style.display === "none") {
								errorMessage.style.display = "block";
								errorMessage.innerHTML = "Username or Password is incorrect"
							}
						}
						
				}
			});
		});
	});
}