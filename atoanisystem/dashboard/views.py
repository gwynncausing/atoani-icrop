from django.shortcuts import render, redirect, HttpResponse
from django.views.generic import View

class CustomerDashboardView(View):
    def get(self,request):
        return render(request,'dashboard/customer-dashboard.html')

class FarmerDashboardView(View):
    def get(self,request):
        return render(request,'dashboard/farmer-dashboard.html')

