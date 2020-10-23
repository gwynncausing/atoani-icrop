from django.shortcuts import render
from django.views.generic import View
from . import helperfunctions as hf

class AdminOrdersView(View):
    def get(self,request):  
        if request.user.is_authenticated:
            currentUser = request.user
            print('awfwafawfwaf')
            print(hf.get_all_order_pairs())
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