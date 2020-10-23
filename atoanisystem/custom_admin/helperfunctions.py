from login_register.models import *
from django.contrib.auth.models import User
from login_register import connectivefunctions as dashboard_utility
from login_register.models import *
from django.utils import timezone as tz

def get_users():
    users = dashboard_utility.display_all_users()
    return users

def get_farmers():
    users = get_users()
    return users['farmer']

def get_unapproved_farmers():
    farmers = get_farmers()
    unapproved_users = []
    for farmer in farmers:
        if not farmer['is_approved']:
            unapproved_users.append(farmer)
    return unapproved_users

def get_customers():
    users = get_users()
    return users['customer']

def get_unapproved_customers():
    customers = get_customers()
    unapproved_users = []
    for customer in customers:
        if not customer['is_approved']:
            unapproved_users.append(customer)
    return unapproved_users

def approve_user(id):
    user = User.objects.get(id=id)
    if hasattr(user,'customer'):
        user.customer.is_approved = True
    elif hasattr(user,'farmer'):
        user.farmer.is_approved = True
    else:
        pass
    user.save()

def format_name(orders,key,newkey):
    for order in orders:
        order[newkey]=order[key][1]+', '+order[key][0]
        del order[key]
    return orders

def get_all_orders():
    df = dashboard_utility.all_orders_datatable()
    orders = dashboard_utility.display_all_orders(df)
    return format_name(orders,'customer_names','customer_name')

def get_all_order_pairs():
    df = dashboard_utility.datatable_order_pairs()
    orders = dashboard_utility.display_all_order_pairs(df)
    orders = format_name(orders,'customer_names','customer_name')
    orders = format_name(orders,'farmer_names','farmer_name')
    return orders

def approve_order(order_id):
    order = Order.objects.get(order_id=order_id)
    order.is_approved = True
    order.save()

def cancel_order(order_id):
    ok = True
    try:
        Order.objects.get(order_id=order_id).delete()
    except:
        ok = False
    return ok

def force_reserve_to(user_id,order_id):
    ok = False
    user = User.objects.get(id=user_id)
    if hasattr(user,'farmer'):
        order_pair = Order_Pairing.objects.create(order_id = order_id, farmer = user.farmer)
        ok = True
    return ok

def complete_order(order_id):
    order = Order.objects.get(order_id=order_id)
    order.status = "Collected"
    order.save()
    order_pair = Order_Pairing.objects.get(order_id=order_id)
    order_pair.status = "Collected"
    order_pair.collected_date = tz.now()