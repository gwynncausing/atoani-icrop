from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.shortcuts import HttpResponse, redirect, render
from django.views.generic import View
from login_register.models import Order
from . import farmerfunctions as ff
from . import customerfunctions as cf



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
                if(currentUser.customer.is_approved):
                    return render(request,'dashboard/customer-dashboard.html')
                else:
                    return redirect("login_register:approval")
        else:
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










class TestView(View):
    def get(self,request):
        if request.is_ajax():
            #does not include deleted customer
            arr = get_incoming_orders()
            json = {'data':arr}
            return JsonResponse(json)
        return render(request,'dashboard/test-datatables.html')

