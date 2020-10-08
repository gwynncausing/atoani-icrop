from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.shortcuts import HttpResponse, redirect, render
from django.views.generic import View


def checkLogin(self, request, currentUser):
    if currentUser.is_authenticated:
        if currentUser.is_staff:
            return redirect("/admin")
        elif hasattr(currentUser, 'farmer'):
            if(currentUser.farmer.is_approved):
                return redirect("dashboard:farmer")
                # return render(request,'dashboard/farmer-dashboard.html')
            else:
                return redirect("login_register:approval")
        elif hasattr(currentUser, 'customer'):
            if(currentUser.customer.is_approved):
                return redirect("dashboard:customer")
                # return render(request,'dashboard/customer-dashboard.html')
            else:
                return redirect("login_register:approval")
    else:
        return False

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

