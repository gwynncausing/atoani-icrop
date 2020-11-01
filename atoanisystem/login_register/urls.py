from django.urls import path
from . import views
from django.contrib.auth import views as auth_views

app_name = 'login_register'

urlpatterns = [
    path('', views.LoginView.as_view(), name="login"),
    path('login/', views.LoginView.as_view(), name="login"),
    path('register/', views.RegistrationView.as_view(), name="register"),
    path('approval/', views.ApprovalView.as_view(), name="approval"),
    path('logout/', views.LogoutView.as_view(), name="logout"),
    path('settings/', views.SettingsView.as_view(), name="settings"),
    path('about_us/', views.AboutUsView.as_view(), name="about-us"),
    path('contact_us/', views.ContactUsView.as_view(), name="contact-us"),
    path('terms_and_conditions_of_use/', views.TermsAndConditionsView.as_view(), name="terms-and-conditions-of-use"),

    path('reset_password/',
        auth_views.PasswordResetView.as_view(template_name="login_register/password_reset.html"),
        name="reset_password"),
    path('password_reset/done/',
        auth_views.PasswordResetDoneView.as_view(template_name="login_register/password_reset_done.html"),
        name="password_reset_done"),
    path('reset/<uidb64>/<token>/',
        auth_views.PasswordResetConfirmView.as_view(template_name="login_register/password_reset_confirm.html"),
        name="password_reset_confirm"),
        # template_name="login_register/password_reset_confirm.html"
    path('reset/done/',
        auth_views.PasswordResetCompleteView.as_view(template_name="login_register/password_reset_complete.html"),
        name="password_reset_complete"),
]
