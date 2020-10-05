from django.shortcuts import render, redirect, HttpResponse
from django.http import JsonResponse
from django.views.generic import View

class CustomerDashboardView(View):
    def get(self,request):
        return render(request,'dashboard/customer-dashboard.html')

class FarmerDashboardView(View):
    def get(self,request):
        return render(request,'dashboard/farmer-dashboard.html')


#get the list of orders
def get_incoming_orders():
    dummy = [
        {'crop_type':'corn','demand':'45 kg','land_area':'123 sqm','order_location':'Argao,Cebu'},
        {'crop_type':'rice','demand':'123 kg','land_area':'5112 sqm','order_location':'Argao,Cebu'},
        {'crop_type':'lalala','demand':'516 kg','land_area':'55 sqm','order_location':'Argao,Cebu'},
        {'crop_type':'corn','demand':'45 kg','land_area':'123 sqm','order_location':'Argao,Cebu'},
        {'crop_type':'rice','demand':'123 kg','land_area':'5112 sqm','order_location':'Argao,Cebu'},
        {'crop_type':'lalala','demand':'516 kg','land_area':'55 sqm','order_location':'Argao,Cebu'},
        {'crop_type':'corn','demand':'45 kg','land_area':'123 sqm','order_location':'Argao,Cebu'},
        {'crop_type':'rice','demand':'123 kg','land_area':'5112 sqm','order_location':'Argao,Cebu'},
        {'crop_type':'lalala','demand':'516 kg','land_area':'55 sqm','order_location':'Argao,Cebu'},
        {'crop_type':'corn','demand':'45 kg','land_area':'123 sqm','order_location':'Argao,Cebu'},
        {'crop_type':'rice','demand':'123 kg','land_area':'5112 sqm','order_location':'Argao,Cebu'},
        {'crop_type':'lalala','demand':'516 kg','land_area':'55 sqm','order_location':'Argao,Cebu'},
    ]
    return dummy

class TestView(View):
    def get(self,request):
        if request.is_ajax():
            #does not include deleted customer
            arr = get_incoming_orders()
            json = {'data':arr}
            return JsonResponse(json)
        return render(request,'dashboard/test-datatables.html')

