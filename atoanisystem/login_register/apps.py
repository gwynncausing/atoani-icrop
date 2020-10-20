from django.apps import AppConfig


class LoginRegisterConfig(AppConfig):
    name = 'login_register'
    def ready(self):
        from scheduler import scheduler
        scheduler.start()
