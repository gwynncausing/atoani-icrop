from django.urls import path
from . import views

app_name = 'dashboard'

urlpatterns = [
    #path('', views.LoginView.as_view(), name="login"),
    path('customer/', views.CustomerDashboardView.as_view(), name="customer"),
    path('farmer/', views.FarmerDashboardView.as_view(), name="farmer"),
    #farmer
    path('get-farmer-incoming-orders', views.FarmerIncomingOrdersView.as_view(), name="get_farmer_incoming_orders"),
    path('get-farmer-reserved-orders', views.FarmerReservedOrdersView.as_view(), name="get_farmer_reserved_orders"),
    path('get-farmer-finished-orders', views.FarmerFinishedOrdersView.as_view(), name="get_farmer_finished_orders"),
    #customers
    path('get-customer-total-orders', views.CustomerTotalOrdersView.as_view(), name="get_customer_total_orders"),
    path('get-customer-reserved-orders', views.CustomerReservedOrdersView.as_view(), name="get_customer_reserved_orders"),
    path('get-customer-finished-orders', views.CustomerFinishedOrdersView.as_view(), name="get_customer_finished_orders"),

    path('test/', views.TestView.as_view(), name="test"),
]
