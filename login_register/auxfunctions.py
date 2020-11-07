
from django.contrib.auth.models import User

def get_name(number:str):
    user = User.objects.filter(username=number).values()
    return user[-1]['first_name'],user[-1]['last_name']
