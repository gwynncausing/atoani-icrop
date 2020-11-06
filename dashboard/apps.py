from django.apps import AppConfig


class DashboardConfig(AppConfig):
    name = 'dashboard'
    # def ready(self):
    #     print("IN READY!")
    #     from login_register.scheduler import scheduler
    #     scheduler.start()
