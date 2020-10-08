from django.shortcuts import render, redirect, HttpResponse
from django.http import JsonResponse
from django.views.generic import View
from login_register.models import Order
from . import farmerfunctions as ff

#Customer related views
class CustomerDashboardView(View):
    def get(self,request):
        return render(request,'dashboard/customer-dashboard.html')

#Farmer related views
class FarmerDashboardView(View):
    def get(self,request):
        return render(request,'dashboard/farmer-dashboard.html')

class IncomingOrdersView(View):
    def get(self,request):
        if request.is_ajax():
            #does not include deleted customer
            arr = ff.get_incoming_orders()
            json = {'data':arr}
            return JsonResponse(json)
        return render(request,'dashboard/customer-dashboard.html')

class ReservedOrdersView(View):
    def get(self,request):
        if request.is_ajax():
            #does not include deleted customer
            arr = ff.get_reserved_orders()
            json = {'data':arr}
            return JsonResponse(json)
        return render(request,'dashboard/customer-dashboard.html')

class FinishedOrdersView(View):
    def get(self,request):
        if request.is_ajax():
            #does not include deleted customer
            arr = ff.get_finished_orders()
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

