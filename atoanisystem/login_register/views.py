from django.shortcuts import render, redirect, HttpResponse
from django.views.generic import View
from django.contrib.auth.models import User, auth
# Create your views here.

class LoginView(View):
    def get(self,request):
        return render(request,'login_register/login.html')
    
    def post(self, request):
        username = request.POST.get("username")
        password = request.POST.get("password")
        user = auth.authenticate(username = username, password = password)
        if user is not None:
            auth.login(request, user)
            if user.is_staff:
                return redirect("/admin")
            else:
                return HttpResponse("login success")    # for testing
        else:
            return redirect("/login") # for testing

class RegistrationView(View):
    def get(self,request):
        return render(request,'login_register/registration.html')
    def post(self,request):
        return render(request,'login_register/registration.html')