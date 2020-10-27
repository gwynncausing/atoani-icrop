from django.urls import path
from . import views

app_name = 'custom_admin'

urlpatterns = [
    #path('', views.LoginView.as_view(), name="login"),
    path('', views.AdminOrdersView.as_view(), name="orders"),
    #ORDERS
    path('orders/', views.AdminOrdersView.as_view(), name="orders"),
    path('get-all-orders/', views.GetAllOrdersView.as_view(), name="get-all-orders"),
    path('get-unapproved-orders/', views.GetWaitlistOrdersView.as_view(), name="get-unapproved-orders"),
    path('get-ongoing-orders/', views.GetOngoingOrdersView.as_view(), name="get-ongoing-orders"),
    path('get-collected-orders/', views.GetCollectedOrders.as_view(), name="get-collected-orders"),
    #USERS
    path('users/', views.GetFarmersView.as_view(), name="users"),
    path('get-all-users/', views.GetAllUsersView.as_view(), name="get-all-users"),
    path('get-unapproved-users/', views.GetUnapprovedUsersView.as_view(), name="get-unapproved-users"),
    path('get-farmers/', views.GetFarmersView.as_view(), name="get-farmers"),
    path('get-customers/', views.GetCustomersView.as_view(), name="get-customers"),
]
