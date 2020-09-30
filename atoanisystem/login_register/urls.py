from django.urls import path
from . import views

app_name = 'login_register'

urlpatterns = [
    path('', views.LoginView.as_view(), name="login"),
    path('login/', views.LoginView.as_view(), name="login"),
    path('register/', views.RegistrationView.as_view(), name="register"),
]
