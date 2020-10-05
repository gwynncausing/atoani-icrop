from django.urls import path
from . import views

app_name = 'dashboard'

urlpatterns = [
    #path('', views.LoginView.as_view(), name="login"),
    path('customer/', views.CustomerDashboardView.as_view(), name="customer"),
    path('farmer/', views.FarmerDashboardView.as_view(), name="farmer"),
]
