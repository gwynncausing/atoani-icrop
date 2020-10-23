from login_register.models import *
from django.contrib.auth.models import User

def get_users():
    users = User.objects.all()
    return users

def get_unapproved_users():
    users = get_users()
    for user in users:
        if hasattr(user,'customer'):
            if user.customer.is_approved:
                print(user.customer.is_approved,user.email)
                users = users.exclude(id=user.id)
        elif hasattr(user,'farmer'):
            if user.farmer.is_approved:
                print(user.farmer.is_approved,user.email)
                users = users.exclude(id=user.id)
        else:
            print(user.id,user.email)
            users = users.exclude(id=user.id)
    return list(users.values())

def approve_user(id,account_type):
    user = User.objects.get(id=id)
    if hasattr(user,'customer'):
        user.customer.is_approved = True
    elif hasattr(user,'farmer'):
        user.farmer.is_approved = True
    else:
        pass
    user.save()


