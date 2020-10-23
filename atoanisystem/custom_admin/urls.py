from django.urls import path
from . import views

app_name = 'custom_admin'

urlpatterns = [
    #path('', views.LoginView.as_view(), name="login"),
    path('', views.AdminOrdersView.as_view(), name="orders"),
    path('orders/', views.AdminOrdersView.as_view(), name="orders"),
    path('users/', views.AdminUsersView.as_view(), name="users"),
]
