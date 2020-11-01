from django.contrib import auth
from django.contrib.auth import login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import Group, User, auth
from django.http import JsonResponse
from django.shortcuts import HttpResponse, redirect, render
from django.views.generic import View
# from django.contrib.auth.views import PasswordChangeView
from django.contrib.auth import update_session_auth_hash
from django.contrib.auth.forms import PasswordChangeForm

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
                else:
                    logout(request)
                    return redirect("login_register:login")
            elif hasattr(currentUser, 'customer'):
                if(currentUser.customer.is_approved):
                    return redirect("dashboard:customer")
                else:
                    logout(request)
                    return redirect("login_register:login")
        else:
            return render(request, 'login_register/login.html')

    def post(self, request):
        if request.is_ajax():
            username = request.POST.get("username")
            password = request.POST.get("password")
            user = auth.authenticate(username = username, password = password)
            if user is not None:
                auth.login(request, user)
                currentUser = user
                if currentUser.is_staff:
                    return JsonResponse({'result':'admin', 'url':'http://127.0.0.1:8000/admin/'},status=200)
                elif hasattr(currentUser, 'farmer'):
                    if(currentUser.farmer.is_approved):
                        return JsonResponse({'result':'farmer ok', 'url':'http://127.0.0.1:8000/dashboard/farmer/'},status=200)
                    else:
                        print("farmer not approved")
                        logout(request)
                        return JsonResponse({'result':'approval'},status=200)
                elif hasattr(currentUser, 'customer'):
                    if(currentUser.customer.is_approved):
                        return JsonResponse({'result':'customer ok', 'url':'http://127.0.0.1:8000/dashboard/customer/'},status=200)
                    else:
                        print("customer not approved")
                        logout(request)
                        return JsonResponse({'result':'approval'},status=200)
            else:
                return JsonResponse({'result':'not ok'},status=500)
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
                    logout(request)
                    return redirect("login_register:login")
            elif hasattr(currentUser, 'customer'):
                if(currentUser.customer.is_approved):
                    return redirect("dashboard:customer")
                else:
                    logout(request)
                    return redirect("login_register:login")
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
            location.name = str(location.brgy) +', '+ str(location.city) + ', ' + str(location.province)
            # if form.street:
            #     location.name=str(location.street)+', '+form.name
            duplicate_list = Location.objects.filter(name=location.name)
            #check if location exists
            if len(duplicate_list) > 1:
                #replace location with the existing location
                location = duplicate_list.first()
            else:
                #save location if it has no duplicates
                location.save()
            new_user = form.save(commit=False)
            new_user.name = user
            if account_type == "Farmer":
                new_user.location = location
                new_user.available_land_area = new_user.land_area
                new_user.is_available = True
                new_user.save()
            # to cater the ManyToManyField of customer.location
            if account_type == "Customer":
                new_user.save()
                new_user.location.add(location)
            return redirect('login_register:login')
        else:
            return HttpResponse(form.errors)

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

class SettingsView(View):
    def get(self, request):
        if request.user.is_authenticated and not request.user.is_staff:
            context = {}
            form = PasswordChangeForm(request.user)
            if(hasattr(request.user, 'customer')):
                locations = Customer.objects.get(id=request.user.customer.id).get_all_locations()
                context = {
                    "locations" : locations,
                }
            return render(request, "login_register/settings.html", context)
        else:
            return redirect("login_register:login")

    def post(self, request):
        # if request.is_ajax():
        data = {}
        if request.is_ajax():
            if request.method == 'POST':
                print(request.POST)
                if 'btn-save-name' in request.POST:
                    firstname = request.POST.get('firstname')
                    lastname = request.POST.get('lastname')
                    user = User.objects.filter(id = request.user.id).update(first_name = firstname, last_name = lastname)
                    data['firstname'] = firstname
                    data['lastname'] = lastname
                    return JsonResponse(data, safe=False, status=200)

                elif 'btn-save-others' in request.POST:
                    print(request.POST)
                    land_area = request.POST.get("land_area")
                    company = request.POST.get("company")
                    data['land_area'] = land_area
                    data['company'] = company
                    Farmer.objects.filter(id = request.user.farmer.id).update(land_area = land_area, company = company)
                    return JsonResponse(data, safe=False, status=200)

                elif 'btn-save-contact' in request.POST:
                    print(request.POST)
                    contact_number = request.POST.get("contact_number")
                    email = request.POST.get("email")
                    print("num: " + str(contact_number) + "\nemail: " + str(email))
                    data['contact_number'] = contact_number
                    data['email'] = email
                    User.objects.filter(id = request.user.id).update(email=email)
                    if(hasattr(request.user, 'farmer')):
                        farmer = Farmer.objects.filter(id = request.user.farmer.id).update(contact_number = contact_number)
                        print(farmer)
                    elif(hasattr(request.user, 'customer')):
                        customer = Customer.objects.filter(id = request.user.customer.id).update(contact_number = contact_number)
                        print(customer)
                    return JsonResponse(data, safe=False, status=200)

                elif 'btn-edit-farmer-address' in request.POST:
                    farmer = request.user.farmer
                    province = request.POST.get('province')
                    city = request.POST.get('city')
                    brgy = request.POST.get('brgy')
                    # street = request.POST.get('street')
                    new_name = str(province) + "," + str(city) + "," + str(brgy)
                    #  + "," + str(street)
                    location, created = Location.objects.get_or_create(name=new_name)
                    if created:
                        new_loc = Location.objects.create(name=new_name, province=province, city=city, brgy=brgy)
                        farmer.set_location(new_loc.id)
                        data['id'] = new_loc.id
                        data['name'] = new_loc.name
                        data['province'] = province
                        data['city'] = city
                        data['brgy'] = brgy
                        # data['street'] = street
                    else:
                        existing_loc = Location.objects.get(name = new_name)
                        farmer.set_location(existing_loc.id)
                        data['id'] = existing_loc.id
                        data['name'] = existing_loc.name
                        data['province'] = existing_loc.province
                        data['city'] = existing_loc.city
                        data['brgy'] = existing_loc.brgy
                        # data['street'] = existing_loc.street
                
                elif 'btn-edit-customer-address' in request.POST:
                    print("clicked edit customer")
                    print(request.POST)
                    customer = request.user.customer
                    location_id = request.POST.get('location-id')
                    print(location_id)
                    province = request.POST.get('province')
                    city = request.POST.get('city')
                    brgy = request.POST.get('brgy')
                    # street = request.POST.get('street')
                    new_name = str(province) + "," + str(city) + "," + str(brgy)
                    #  + "," + str(street)
                    old_loc = Location.objects.get(id=location_id)
                    # location, created = Location.objects.get_or_create(name=new_name)
                    exists = Location.objects.filter(name=new_name).exists()
                    # if created:
                    if not exists:
                        new_loc = Location.objects.create(name=new_name, province = province, city = city, brgy = brgy)
                        data['id'] = new_loc.id
                        data['name'] = new_loc.name
                        data['province'] = province
                        data['city'] = city
                        data['brgy'] = brgy
                        # data['street'] = street
                        # customer.replace_location(old_loc.id, new_loc.id)
                        customer.location.remove(old_loc)
                        customer.location.add(new_loc)
                        print("created new")
                    else:
                        existing_loc = Location.objects.filter(name = new_name)[0]
                        
                        # customer.replace_location(old_loc.id, existing_loc.id)
                        customer.location.remove(old_loc)
                        customer.location.add(existing_loc)

                        data['id'] = existing_loc.id
                        data['name'] = existing_loc.name
                        data['province'] = existing_loc.province
                        data['city'] = existing_loc.city
                        data['brgy'] = existing_loc.brgy
                        # data['street'] = existing_loc.street
                        print("added existing")

                elif 'btn-delete-address' in request.POST:
                    print("clicked delete")
                    customer = request.user.customer
                    location_id = request.POST.get('location-id-delete')
                    print("selected to delete: " + str(location_id))
                    customer.location.remove(Location.objects.get(id=location_id))    
                
                elif 'btn-save-account' in request.POST:
                    print(request.POST)
                    user = request.user
                    username = request.POST.get('username')
                    current_pass = request.POST.get('current_pass')
                    new_pass = request.POST.get('new_password1')
                    retype_pass = request.POST.get('new_password2')
                    print(username)
                    print(current_pass)
                    if user.check_password(current_pass):
                        print("correct pass")
                        if(new_pass == retype_pass):
                            print("passwords the same")
                            user.set_password(new_pass)
                            user.save()
                            update_session_auth_hash(request, user)
                            print("password changed")
                        else:
                            print("new passwords not the same")
                    else:
                        print("password is incorrect")

                elif 'btn-add-customer-address':
                    customer = request.user.customer
                    province = request.POST.get('province')
                    city = request.POST.get('city')
                    brgy = request.POST.get('brgy')
                    # street = request.POST.get('street')
                    new_name = str(province) + "," + str(city) + "," + str(brgy)
                    #  + "," + str(street)
                    exists = Location.objects.filter(name=new_name).exists()
                    if not exists:
                        new_loc = Location.objects.create(name=new_name, province = province, city = city, brgy = brgy)
                        data['id'] = new_loc.id
                        data['name'] = new_loc.name
                        data['province'] = province
                        data['city'] = city
                        data['brgy'] = brgy
                        # data['street'] = street
                        customer.location.add(new_loc)
                        print("added new")
                    else:
                        existing_loc = Location.objects.filter(name = new_name)[0]
                        customer.location.add(existing_loc)
                        data['id'] = existing_loc.id
                        data['name'] = existing_loc.name
                        data['province'] = existing_loc.province
                        data['city'] = existing_loc.city
                        data['brgy'] = existing_loc.brgy
                        # data['street'] = existing_loc.street
                        print("added existing")
                



                return JsonResponse(data, safe=False, status=200)

            else:
                return HttpResponse('')


# class ChangePasswordView(View):
#     def get(self, request):
#         if request.method == 'POST':
#             form = PasswordChangeForm(request.POST, instance=request.user)
#             if form.is_valid():
#                 user = form.save()
#                 update_session_auth_hash(request, user)  # Important!
#                 print('Your password was successfully updated!')
#                 return redirect('login_register: login')
#             else:
#                 print('Please correct the error below.')
#         else:
#             form = PasswordChangeForm(request.user)
#         return render(request, 'login_register/change-password.html', {
#             'form': form
#         })

class AboutUsView(View):
    def get(self,request):
        return render(request, "login_register/about-us.html")

class ContactUsView(View):
    def get(self,request):
        return render(request, "login_register/contact-us.html")

class TermsAndConditionsView(View):
    def get(self,request):
        return render(request, "login_register/terms-and-conditions.html")

class ForgotUsernamePasswordView(View):
    def get(self,request):
        return render(request, "login_register/forgot-username-password.html")

def handler404(request, *args, **argv):
    response = render(request, "error_pages/404.html")
    response.status_code = 404
    return response

def handler500(request, *args, **argv):
    response = render(request, "error_pages/500.html")
    response.status_code = 404
    return response


