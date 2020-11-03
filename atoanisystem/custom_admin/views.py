from django.shortcuts import render,redirect
from django.views.generic import View
from django.http import JsonResponse
from . import helperfunctions as hf

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