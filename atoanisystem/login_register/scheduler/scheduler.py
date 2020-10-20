# source: https://stackoverflow.com/questions/62525295/how-to-use-python-to-schedule-tasks-in-a-django-application

from apscheduler.schedulers.background import BackgroundScheduler
from django_apscheduler.jobstores import DjangoJobStore, register_events
from django.utils import timezone
from django_apscheduler.models import DjangoJobExecution
import sys
from login_register.connectivefunctions import check_obsolete_orders


def start():
    scheduler = BackgroundScheduler()
    scheduler.add_jobstore(DjangoJobStore(), "default")
    # run this job every 24 hours
    scheduler.add_job(check_obsolete_orders, 'interval', hours=24, name='clean_orders', jobstore='default')
    register_events(scheduler)
    scheduler.start()
    print("Scheduler started...", file=sys.stdout)
