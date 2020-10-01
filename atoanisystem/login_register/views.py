from django.shortcuts import render
from django.views.generic import View
from django.http import HttpResponse
# Create your views here.

#from .forms import CustomerForm, FarmerForm

class LoginView(View):
    def get(self,request):
        return render(request,'login_register/login.html')

class RegistrationView(View):
    def get(self,request):
        return render(request,'login_register/registration.html')
    
    def post(self,request):
        
        account_type = request.POST.get('account-type')
        form = None
        
        # if account_type == 'customer':
        #     form = CustomerForm(request.POST)
        # else:
        #     form = FarmerForm(request.POST)

        if form.is_valid():
            farmer = request.POST.get('account-type');
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
            
