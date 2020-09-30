from django.shortcuts import render
from django.views.generic import View
# Create your views here.

class LoginView(View):
    def get(self,request):
        return render(request,'login_register/login.html')

class RegistrationView(View):
    def get(self,request):
        return render(request,'login_register/registration.html')