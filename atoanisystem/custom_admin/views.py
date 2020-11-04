from django.shortcuts import render,redirect
from django.views.generic import View
from django.http import JsonResponse
from . import helperfunctions as hf
from login_register.models import Crop, Location

##############################
#       ORDERS SECTION       #
##############################

class AdminOrdersView(View):
    def get(self,request):  
        if request.user.is_authenticated:
            currentUser = request.user
            if currentUser.is_staff:
                return render(request, 'custom_admin/admin-orders.html')
            else:
                return redirect('login_register:login')
        else:
            return redirect('login_register:login')

class GetAllOrdersView(View):
    def get(self,request):
        if request.is_ajax():
            #does not include deleted customer
            orders = hf.get_all_orders()
            #orders.extend(hf.get_all_order_pairs())
            arr = orders
            json = {'data':arr}
            return JsonResponse(json)
        return render(request, 'custom_admin/admin-orders.html')
    
    def post(self,request):
        if request.is_ajax():
            json = {'status':hf.cancel_order(request.POST.get("order-id"))}
            return JsonResponse(json)

class GetApprovedOrdersView(View):
    def get(self,request):
        if request.is_ajax():
            #does not include deleted customer
            orders = hf.get_all_orders()
            #orders.extend(hf.get_all_order_pairs())
            arr = hf.get_approved_orders(orders)
            json = {'data':arr}
            return JsonResponse(json)
        return render(request, 'custom_admin/admin-orders.html')

class GetWaitlistOrdersView(View):
    def get(self,request):
        if request.is_ajax():
            #does not include deleted customer
            orders = hf.get_all_orders()
            #orders.extend(hf.get_all_order_pairs())
            arr = hf.get_unapproved_orders(orders)
            json = {'data':arr}
            return JsonResponse(json)
        return render(request, 'custom_admin/admin-orders.html')

    def post(self,request):
        if request.is_ajax():
            json = {'status':hf.approve_order(request.POST.get("order-id"))}
            return JsonResponse(json)

class GetOngoingOrdersView(View):
    def get(self,request):
        if request.is_ajax():
            #does not include deleted customer
            orders = hf.get_all_orders()
            #orders.extend(hf.get_all_order_pairs())
            arr = hf.get_ongoing_orders(orders)
            json = {'data':arr}
            return JsonResponse(json)
        return render(request, 'custom_admin/admin-orders.html')

    def post(self,request):
        if request.is_ajax():
            json = {'status':hf.harvest_order(request.POST.get("order-id"))}
            return JsonResponse(json)

class GetHarvestedOrdersView(View):
    def get(self,request):
        if request.is_ajax():
            #does not include deleted customer
            orders = hf.get_all_orders()
            #orders.extend(hf.get_all_order_pairs())
            arr = hf.get_harvested_orders(orders)
            json = {'data':arr}
            return JsonResponse(json)
        return render(request, 'custom_admin/admin-orders.html')

    def post(self,request):
        if request.is_ajax():
            json = {'status':hf.complete_order(request.POST.get("order-id"))}
            return JsonResponse(json)

class GetCollectedOrders(View):
    def get(self,request):
        if request.is_ajax():
            #does not include deleted customer
            orders = hf.get_all_orders()
            #orders.extend(hf.get_all_order_pairs())
            arr = hf.get_collected_orders(orders)
            json = {'data':arr}
            return JsonResponse(json)
        return render(request, 'custom_admin/admin-orders.html')

    def post(self,request):
        if request.is_ajax():
            json = {'status':hf.deliver_order(request.POST.get("order-id"))}
            return JsonResponse(json)

class GetDeliveredOrders(View):
    def get(self,request):
        if request.is_ajax():
            #does not include deleted customer
            orders = hf.get_all_orders()
            #orders.extend(hf.get_all_order_pairs())
            arr = hf.get_delivered_orders(orders)
            json = {'data':arr}
            return JsonResponse(json)
        return render(request, 'custom_admin/admin-orders.html')

class GetCancelledOrders(View):
    def get(self,request):
        if request.is_ajax():
            #does not include deleted customer
            orders = hf.get_orders()
            #orders.extend(hf.get_all_order_pairs())
            arr = hf.get_cancelled_orders(orders)
            json = {'data':arr}
            return JsonResponse(json)
        return render(request, 'custom_admin/admin-orders.html')

##############################
#       USERS SECTION        #
##############################

class AdminUsersView(View):
    def get(self,request):  
        if request.user.is_authenticated:
            currentUser = request.user
            if currentUser.is_staff:
                return render(request, 'custom_admin/admin-users.html')
            else:
                return redirect('login_register:login')
        else:
            return redirect('login_register:login')

class GetAllUsersView(View):
    def get(self,request):
        if request.is_ajax():
            users = hf.get_farmers()
            customers = hf.get_customers()
            users.extend(customers)
            hf.format_name_of_users(users)
            arr = users
            print(arr)
            json = {'data':arr}
            return JsonResponse(json)
        return render(request, 'custom_admin/admin-users.html')
    
    def post(self,request):
        if request.is_ajax():
            if request.POST.get('operation') == 'approve':
                hf.approve_user(request.POST.get("user-id"))
            elif request.POST.get('operation') == 'unapprove':
                hf.unapprove_user(request.POST.get("user-id"))
            elif request.POST.get('operation') == 'reset-password':
                hf.reset_password(request.POST.get("user-id"))
            else:
                pass
            json = {'status':'Ok'}
            return JsonResponse(json)

class GetUnapprovedUsersView(View):
    def get(self,request):
        if request.is_ajax():
            farmers = hf.get_unapproved_farmers()
            customers = hf.get_unapproved_customers()
            farmers.extend(customers)
            hf.format_name_of_users(farmers)
            arr = farmers
            json = {'data':arr}
            return JsonResponse(json)
        return render(request, 'custom_admin/admin-users.html')

class GetFarmersView(View):
    def get(self,request):
        if request.is_ajax():
            farmers = hf.get_farmers()
            hf.format_name_of_users(farmers)
            arr = farmers
            print(arr)
            json = {'data':arr}
            return JsonResponse(json)
        return render(request, 'custom_admin/admin-users.html')

class GetCustomersView(View):
    def get(self,request):
        if request.is_ajax():
            customers = hf.get_customers()
            hf.format_name_of_users(customers)
            arr = customers
            json = {'data':arr}
            return JsonResponse(json)
        return render(request, 'custom_admin/admin-users.html')

##############################
#      OTHERS SECTION        #
##############################
class AdminCropsView(View):
    def get(self,request):  
        if request.user.is_authenticated:
            currentUser = request.user
            if currentUser.is_staff:
                crops = hf.get_all_crops()
                print(crops)
                return render(request, 'custom_admin/admin-crops.html')
            else:
                return redirect('login_register:login')
        else:
            return redirect('login_register:login')

class GetAllCropsView(View):
    def get(self,request):
        if request.is_ajax():
            crops = hf.get_all_crops()
            arr = crops
            json = {'data':arr}
            return JsonResponse(json)
        return render(request, 'custom_admin/admin-users.html')
    
    def post(self,request):
        if request.is_ajax():
            if request.POST.get('operation') == 'delete-crop':
                hf.delete_crop(request.POST.get("crop-id"))
            elif request.POST.get('operation') == 'add-crop':
                print('\n\n\n\n',request.POST)
                is_seasonal = False
                season_start = None
                season_end = None
                if request.POST.get('is-seasonal') == 'on':
                    is_seasonal = True
                    season_start = request.POST.get('season-start')
                    season_end = request.POST.get('season-end')

                name = request.POST.get('crop-name')
                province = request.POST.get('province')
                harvest_weight_per_land_area = request.POST.get('weight')
                harvest_time = request.POST.get('harvest-time')
                productivity = request.POST.get('productivity')
                
                crop = Crop(
                    name = name,
                    is_seasonal = is_seasonal,
                    season_start = season_start,
                    season_end = season_end,
                    harvest_weight_per_land_area = harvest_weight_per_land_area,
                    harvest_time = harvest_time,
                    productivity = productivity
                )
                crop.save()
                location = Location(province=province)
                location.name = str(province)
                duplicate_list = Location.objects.filter(name=location.name)
                if len(duplicate_list) >= 1:
                    location = duplicate_list.first()
                else:
                    location.save()
                hf.add_crop(crop,location)
            else:
                pass
            json = {'status':'OK'}
            return JsonResponse(json)
        return render(request, 'custom_admin/admin-crops.html') 