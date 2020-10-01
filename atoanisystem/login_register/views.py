from django.shortcuts import render, redirect, HttpResponse
from django.views.generic import View
from django.http import JsonResponse
from .models import Customer, Farmer, Location
# Create your views here.

#from .forms import CustomerForm, FarmerForm

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
        if request.is_ajax():
            # check contact number if it already exists
            if Customer.objects.filter(contact_number=request.POST.get('contact-number')).exists() and Farmer.objects.filter(contact_number=request.POST.get('contact-number')).exists():
                return JsonResponse({'result':'not ok'},status=500)
            else:
                return JsonResponse({'result':'ok'},status=200)
        account_type = request.POST.get('account-type')
        form = None
        # if account_type == 'customer':
        #     form = CustomerForm(request.POST)
        # else:
        #     form = FarmerForm(request.POST)
        if form.is_valid():
            farmer = request.POST.get('account-type')
            first_name = request.POST.get('first-name')
            last_name = request.POST.get('last-name')
            middle_name = request.POST.get('middle-name')
            province = request.POST.get('province')
            city = request.POST.get('city')
            barangay = request.POST.get('barangay')
            street = request.POST.get('street')
            contact_number = request.POST.get('contact_number')
            company_name = request.POST.get('company_name')
            email = request.POST.get('email')
            password = request.POST.get('password')
            
            form.save()

            return HttpResponse("Success")
        else:
            return HttpResponse("Fail")
