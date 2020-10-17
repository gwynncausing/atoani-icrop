from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.shortcuts import HttpResponse, redirect, render
from django.views.generic import View
from login_register.models import Order 
from . import farmerfunctions as ff
from . import customerfunctions as cf
from login_register.models import *

from login_register.forms import *

from login_register.connectivefunctions import calculate_land_area_single

#########################################################
#               Farmer related views                    #
#########################################################
class FarmerDashboardView(View):
    def get(self,request):  
        if request.user.is_authenticated:
            currentUser = request.user
            if currentUser.is_staff:
                return redirect("/admin")
            elif hasattr(currentUser, 'farmer'):
                if(currentUser.farmer.is_approved):
                    return render(request,'dashboard/farmer-dashboard.html')
                else:
                    return redirect("login_register:approval")
            elif hasattr(currentUser, 'customer'):
                if(currentUser.customer.is_approved):
                    return render(request,'dashboard/customer-dashboard.html')
                else:
                    return redirect("login_register:approval")
        else:
            return redirect('login_register:login')
        return render(request,'dashboard/farmer-dashboard.html')
    def post(self,request):
        if request.is_ajax():
            #checks order availability and if it is, temporarily reserves it
            if request.POST.get('operation') == 'check-order':
                status = 500
                order = Order.objects.get(order_id=request.POST.get('order-id'))
                if not order.is_reserved:
                    status = 200
                    order.is_reserved = True
                    order.save()
                json = {'data': ''}
                return JsonResponse(data=json,status=status)
            #this is to handle the case that the farmer does not want to reserve the order and cancels while the order is reserved
            elif request.POST.get('operation') == 'cancel-reserve':
                order = Order.objects.get(order_id=request.POST.get('order-id'))
                order.is_reserved = False
                order.save()
                json = {'data': ''}
                return JsonResponse(data=json,status=200)
            #binds the order and farmer in an order_pair instance
            elif request.POST.get('operation') == 'confirm-reserve':
                order = Order.objects.get(order_id=request.POST.get('order-id'))
                order.status = "Ongoing"
                order.save()
                order_pair = ff.reserve_to(request.user.farmer,order)
                json = {'data': ''}
                return JsonResponse(data=json,status=200)

class FarmerIncomingOrdersView(View):
    def get(self,request):
        if request.is_ajax():
            #does not include deleted customer
            arr = ff.get_incoming_orders(request.user)
            json = {'data':arr}
            return JsonResponse(json)
        return render(request,'dashboard/farmer-dashboard.html')

class FarmerReservedOrdersView(View):
    def get(self,request):
        if request.is_ajax():
            #does not include deleted customer
            arr = ff.get_reserved_orders(request.user)
            json = {'data':arr}
            return JsonResponse(json)
        return render(request,'dashboard/farmer-dashboard.html')

class FarmerFinishedOrdersView(View):
    def get(self,request):
        if request.is_ajax():
            #does not include deleted customer
            arr = ff.get_finished_orders(request.user)
            json = {'data':arr}
            return JsonResponse(json)
        return render(request,'dashboard/farmer-dashboard.html')

#########################################################
#               Customer related views                  #
#########################################################

class CustomerDashboardView(View):
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
                #Crop Context
                if(currentUser.customer.is_approved):
                    
                    #get all crops
                    crops = cf.get_all_crops()
                    context = {
                        'crops': crops,
                    }
                    
                    #print(request.user.id)
                    #print(request.user.customer.id)
                    #print(request.user.customer.location.all())
                    
                    return render(request,'dashboard/customer-dashboard.html', context)
                else:
                    return redirect("login_register:approval")
        else:
            return redirect('login_register:login')

    def post(self,request):
        if request.is_ajax():
            print("request was ajax")
            if request.POST.get('operation') == 'create-order':
                
                print(request.POST)
                
                demand = request.POST.get('weight')
                location_id = request.POST.get('address')
                crop_id = request.POST.get('crop-id')
                
                #print("Crop: " + crop_id)                
                crop = Crop.objects.get(id=crop_id)  
                customer = request.user.customer     
                         
                #check if address is custom
                if location_id == 'custom-address':
                    street = request.POST.get('street')
                    brgy = request.POST.get('barangay')
                    city = request.POST.get('city')
                    province = request.POST.get('province')
                    location = Location.objects.create(street=street,brgy=brgy,city=city,province=province)
                    location.name = str(location.brgy) +', '+ str(location.city) + ', ' + str(location.province)
                    location.save();
                    location_id = location.id;
                
                location = Location.objects.get(id=location_id)
                
                order = cf.create_order(customer,crop,demand,location,0)

                arr = cf.get_total_orders(request.user)
                json = {'data':arr}
                return JsonResponse(json)
         
        return redirect('login_register:login')

class CustomerTotalOrdersView(View):
    def get(self,request):
        if request.is_ajax():
            #does not include deleted customer
            arr = cf.get_total_orders(request.user)
            json = {'data':arr}
            return JsonResponse(json)
        return render(request,'dashboard/customer-dashboard.html')

class CustomerReservedOrdersView(View):
    def get(self,request):
        if request.is_ajax():
            #does not include deleted customer
            arr = cf.get_reserved_orders(request.user)
            json = {'data':arr}
            return JsonResponse(json)
        return render(request,'dashboard/customer-dashboard.html')

class CustomerFinishedOrdersView(View):
    def get(self,request):
        if request.is_ajax():
            #does not include deleted customer
            arr = cf.get_finished_orders(request.user)
            json = {'data':arr}
            return JsonResponse(json)
        return render(request,'dashboard/customer-dashboard.html')

class CustomerFinishedOrdersViewModal(View):
    def get(self, request):
        order_id = request.GET.get('id', None)
        name1 = request.GET.get('name', None)
        address1 = request.GET.get('address', None)
        age1 = request.GET.get('age', None)

        user = {'id':obj.id,'name':obj.name,'address':obj.address,'age':obj.age}

        data = {
            'user': user
        }
        return JsonResponse(data)

class AccountView(View):
    def post(self, request):
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
            elif request.POST.get('input') == 'password':
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
            #check if location exists
            location = location_form.save(commit=False)
            location.name = str(location.brgy) +', '+ str(location.city) + ', ' + str(location.province)
            if location.street:
                location.name=str(location.street)+', '+location.name
            location.save()
            new_user = form.save(commit=False)
            new_user.name = user
            new_user.location = location
            new_user.save()
        return render(request,'dashboard/customer-dashboard.html')
    

