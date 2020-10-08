from django.contrib import auth
from django.contrib.auth import login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import Group, User, auth
from django.http import JsonResponse
from django.shortcuts import HttpResponse, redirect, render
from django.views.generic import View

from .forms import *
from .models import Customer, Farmer, Location

# Create your views here.

#from .forms import CustomerForm, FarmerForm

# @login_required(login_url="/login")
class LoginView(View):
    def get(self,request):
        if request.user.is_authenticated:
            currentUser = request.user
            if currentUser.is_staff:
                return redirect("/admin")
            elif hasattr(currentUser, 'farmer'):
                if(currentUser.farmer.is_approved):
                    return redirect("dashboard:farmer")
                    # return render(request,'dashboard/farmer-dashboard.html')
                else:
                    return redirect("login_register:approval")
            elif hasattr(currentUser, 'customer'):
                if(currentUser.customer.is_approved):
                    return redirect("dashboard:customer")
                    # return render(request,'dashboard/customer-dashboard.html')
                else:
                    return redirect("login_register:approval")
        else:
            return render(request, 'login_register/login.html')

    def post(self, request):
        username = request.POST.get("username")
        password = request.POST.get("password")
        user = auth.authenticate(username = username, password = password)
        if user is not None:
            auth.login(request, user)
            currentUser = user
            if currentUser.is_staff:
                return redirect("/admin")
            elif hasattr(currentUser, 'farmer'):
                if(currentUser.farmer.is_approved):
                    return redirect("dashboard:farmer")
                    # return render(request,'dashboard/farmer-dashboard.html')
                else:
                    return redirect("login_register:approval")
            elif hasattr(currentUser, 'customer'):
                if(currentUser.customer.is_approved):
                    return redirect("dashboard:customer")
                    # return render(request,'dashboard/customer-dashboard.html')
                else:
                    return redirect("login_register:approval")
        else:
            return render(request, 'login_register/login.html')

class RegistrationView(View):
    def get(self,request):
        if request.user.is_authenticated:
            currentUser = request.user
            if currentUser.is_staff:
                return redirect("/admin")
            elif hasattr(currentUser, 'farmer'):
                if(currentUser.farmer.is_approved):
                    return redirect("dashboard:farmer")
                else:
                    return redirect("login_register:approval")
            elif hasattr(currentUser, 'customer'):
                if(currentUser.customer.is_approved):
                    return redirect("dashboard:customer")
                else:
                    return redirect("login_register:approval")
        else:
            return render(request,'login_register/registration.html')
    def post(self,request):
        if request.is_ajax():
            if request.POST.get('input') == 'contact_number':
                # check contact number if it already exists
                if Customer.objects.filter(contact_number=request.POST.get('contact_number')).exists() or Farmer.objects.filter(contact_number=request.POST.get('contact_number')).exists():
                    return JsonResponse({'result':'not ok'},status=500)
                else:
                    return JsonResponse({'result':'ok'},status=200)
            elif request.POST.get('input') == 'username':
                # check username if it already exists
                if User.objects.filter(username=request.POST.get('username')).exists():
                    return JsonResponse({'result':'not ok'},status=500)
                else:
                    return JsonResponse({'result':'ok'},status=200)
            elif request.POST.get('input') == 'email':
                # check username if it already exists
                if User.objects.filter(email=request.POST.get('email')).exists():
                    return JsonResponse({'result':'not ok'},status=500)
                else:
                    return JsonResponse({'result':'ok'},status=200)
            else:
                pass
        firstname = request.POST.get('first-name')
        lastname = request.POST.get('last-name')
        #replace by username field 
        username = request.POST.get('username')
        email = request.POST.get('email')
        password = request.POST.get('password1')
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
        #return HttpResponse(location_form.errors)
        return redirect('login_register:login')

class ApprovalView(View):
    def get(self,request):
        if request.user.is_authenticated:
            currentUser = request.user
            if currentUser.is_staff:
                return redirect("/admin")
            elif hasattr(currentUser, 'farmer'):
                if(currentUser.farmer.is_approved):
                    return redirect("dashboard:farmer")
                else:
                    return render(request, "login_register/needs-approval.html")
            elif hasattr(currentUser, 'customer'):
                if(currentUser.customer.is_approved):
                    return redirect("dashboard:customer")
                else:
                    return render(request, "login_register/needs-approval.html")
        else:
            return redirect("login_register:login")

class LogoutView(View):
    def get(self,request):
        logout(request)
        return  redirect("/login")
    def post(self,request):
        logout(request)
        return  redirect("/login")

