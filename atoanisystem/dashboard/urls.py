from django.urls import path
from . import views

app_name = 'dashboard'

urlpatterns = [
    #path('', views.LoginView.as_view(), name="login"),
    path('customer/', views.CustomerDashboardView.as_view(), name="customer"),
    path('farmer/', views.FarmerDashboardView.as_view(), name="farmer"),
    path('get-incoming-orders', views.IncomingOrdersView.as_view(), name="get_incoming_orders"),
    path('get-ongoing-orders', views.IncomingOrdersView.as_view(), name="get_ongoing_orders"),
    path('get-finished-orders', views.IncomingOrdersView.as_view(), name="get_finished_orders"),
    path('test/', views.TestView.as_view(), name="test"),
]
