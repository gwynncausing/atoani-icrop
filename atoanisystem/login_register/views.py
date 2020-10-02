from django.shortcuts import render, redirect, HttpResponse
from django.views.generic import View
from django.contrib.auth.models import User, auth
from django.http import JsonResponse
from .models import Customer, Farmer, Location
from django.contrib.auth.models import User, Group
from django.contrib.auth import logout
from django.contrib import auth
from .forms import *

# Create your views here.

#from .forms import CustomerForm, FarmerForm

class LoginView(View):
    def get(self,request):
        return render(request,'login_register/login.html')

    def post(self, request):
        username = request.POST.get("username")
        password = request.POST.get("password")
        user = auth.authenticate(username = username, password = password)
        is_approved = False
        if user is not None:
            auth.login(request, user)
            if hasattr(user,'farmer'):
                is_approved = user.farmer.is_approved
            if hasattr(user,'customer'):
                is_approved = user.customer.is_approved
            if not is_approved:
                return render(request,'login_register/needs-approval.html',{'user': request.user})
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
        if request.is_ajax():
            # check contact number if it already exists
            if Customer.objects.filter(contact_number=request.POST.get('contact_number')).exists() or Farmer.objects.filter(contact_number=request.POST.get('contact_number')).exists():
                return JsonResponse({'result':'not ok'},status=500)
            else:
                return JsonResponse({'result':'ok'},status=200)
        firstname = request.POST.get('first-name')
        lastname = request.POST.get('last-name')
        #replace by username field 
        username = request.POST.get('contact_number')
        email = request.POST.get('email')
        password = request.POST.get('password')
        user = User.objects.create_user(first_name=firstname,last_name=lastname,username=username,email=email,password=password)
        location_form = LocationForm(request.POST)
        account_type = request.POST.get('account-type')
        Group.objects.get(name=account_type).user_set.add(user)
        if account_type == 'Farmer':
            form = FarmerForm(request.POST)
        if account_type == 'Customer':
            form = CustomerForm(request.POST)
        if form.is_valid() and location_form.is_valid():
            location = location_form.save(commit=False)
            location.name = str(location.province)+','+str(location.city)+','+str(location.brgy)+','+str(location.street)
            location.save()
            new_user = form.save(commit=False)
            new_user.name = user
            new_user.location = location
            new_user.save()
        return redirect('login_register:login')

class ApprovalView(View):
    def get(self,request):
        if request.user.is_authenticated:
            print("AUTHENTICATED")
            print(request.user)
            return render(request,'login_register/needs-approval.html',{'user': request.user})
        else:
            return render(request,'login_register/login.html')

class LogoutView(View):
    def get(self,request):
        logout(request)
        return  redirect("/login")
    def post(self,request):
        logout(request)
        return  redirect("/login")