from django.apps import AppConfig


class LoginRegisterConfig(AppConfig):
    name = 'login_register'
    def ready(self):
        print("IN READY!")
        from login_register.scheduler import scheduler
        scheduler.start()
