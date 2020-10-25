from django.shortcuts import render
from django.views.generic import View
from django.http import JsonResponse
from . import helperfunctions as hf

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