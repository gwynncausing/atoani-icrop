from login_register.models import *
from django.contrib.auth.models import User
from login_register import connectivefunctions as dashboard_utility
from login_register.models import *
from django.utils import timezone as tz
import math

def format_name_of_users(users):
    for user in users:
        user['name']=user['last_name']+', '+user['first_name']
    return users

def format_nan_values(list,column_key):
    for x in list:
        if math.isnan(x[column_key]):
            x[column_key]=None

def get_users():
    users = dashboard_utility.display_all_users()
    print('BEFORE GETTING CUST/FARM',users)
    return users

def get_farmers():
    users = get_users()
    farmers = []
    try:
        farmers = users['farmer']
    except:
        pass
    format_nan_values(farmers,'land_area')
    return farmers

def get_unapproved_farmers():
    farmers = get_farmers()
    unapproved_users = []
    for farmer in farmers:
        if not farmer['is_approved']:
            unapproved_users.append(farmer)
    return unapproved_users

def get_customers():
    users = get_users()
    customers = []
    try:
        customers = users['customer']
    except:
        pass
    return customers

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
        user.customer.save()
    elif hasattr(user,'farmer'):
        user.farmer.is_approved = True
        user.farmer.save()
    else:
        print("Unable to approve, no customer or farmer attribute")
    user.save()

def unapprove_user(id):
    user = User.objects.get(id=id)
    if hasattr(user,'customer'):
        user.customer.is_approved = False
        user.customer.save()
    elif hasattr(user,'farmer'):
        user.farmer.is_approved = False
        user.farmer.save()
    else:
        print("Unable to approve, no customer or farmer attribute")
    user.save()

def reset_password(id):
    user = User.objects.get(id=id)
    new_password = 'atoani.'+user.username
    user.set_password(new_password)
    user.save()

def format_name(orders,key,newkey):
    for order in orders:
        order[newkey]=order[key][1]+', '+order[key][0]
        del order[key]
    return orders

#gets all orders including Cancelled
def get_orders():
    df = dashboard_utility.datatable_orders()
    orders = dashboard_utility.display_all_orders(df)
    print('printing df',df)
    if orders:
        format_name(orders,'customer_names','customer_name')
    else:
        orders = []
    return orders

#gets all orders except Cancelled
def get_all_orders():
    orders = get_orders()
    all_orders = []
    for order in orders:
        if order['status'] != "Cancelled":
            all_orders.append(order)
    return all_orders

def get_all_order_pairs():
    df = dashboard_utility.datatable_order_pairs()
    orders = dashboard_utility.display_all_order_pairs(df)
    orders = format_name(orders,'customer_names','customer_name')
    orders = format_name(orders,'farmer_names','farmer_name')
    orders = list(filter(lambda order: order.status != "cancelled", orders))
    print(orders)
    return orders

def get_unapproved_orders(orders):
    unapproved_orders = []
    for order in orders:
        if order['status'] == "Pending":
            unapproved_orders.append(order)
    return unapproved_orders

def get_approved_orders(orders):
    approved_orders = []
    for order in orders:
        if order['status'] == "Posted":
            approved_orders.append(order)
    return approved_orders

def get_ongoing_orders(orders):
    ongoing_orders = []
    for order in orders:
        if order['status'] == "Ongoing":
            ongoing_orders.append(order)
    return ongoing_orders

def get_harvested_orders(orders):
    harvested_orders = []
    for order in orders:
        if order['status'] == "Harvested":
            print("ITS HARVESTED")
            harvested_orders.append(order)
    return harvested_orders

def get_collected_orders(orders):
    collected_orders = []
    for order in orders:
        if order['status'] == "Collected":
            collected_orders.append(order)
    return collected_orders

def get_delivered_orders(orders):
    delivered_orders = []
    for order in orders:
        if order['status'] == "Delivered":
            delivered_orders.append(order)
    return delivered_orders

def get_cancelled_orders(orders):
    cancelled_orders = []
    for order in orders:
        if order['status'] == "Cancelled":
            cancelled_orders.append(order)
    return cancelled_orders

def approve_order(order_id):
    order = Order.objects.get(order_id=order_id)
    order.is_approved = True
    order.save()

def cancel_order(order_id):
    ok = False
    order = Order.objects.get(order_id=order_id)
    if order.status != "Finished":
        order.status = "Cancelled"
        order.is_cancelled = True
        order.save()
        #Needs to catch exception when order is not reserved
        try:
            order_pair = Order_Pairing.objects.get(order_id=order)
            order_pair.status = "Cancelled"
            order_pair.save()
        except:
            pass
        ok = True
    return ok

def force_reserve_to(user_id,order_id):
    ok = False
    user = User.objects.get(id=user_id)
    if hasattr(user,'farmer'):
        order_pair = Order_Pairing.objects.create(order_id = order_id, farmer = user.farmer)
        ok = True
    return ok

def harvest_order(order_id):
    order = Order.objects.get(order_id=order_id)
    order.status = "Harvested"
    order.save()
    order_pair = Order_Pairing.objects.get(order_id=order_id)
    order_pair.status = "Harvested"
    order_pair.harvested_date = tz.now()
    order_pair.save()

def complete_order(order_id):
    order = Order.objects.get(order_id=order_id)
    order.status = "Collected"
    order.save()
    order_pair = Order_Pairing.objects.get(order_id=order_id)
    order_pair.status = "Collected"
    order_pair.collected_date = tz.now()
    order_pair.save()

def deliver_order(order_id):
    order = Order.objects.get(order_id=order_id)
    order.status = "Delivered"
    order.save()
    order_pair = Order_Pairing.objects.get(order_id=order_id)
    order_pair.status = "Delivered"
    order_pair.delivered_date = tz.now()
    order_pair.save()

def get_all_crops():
    crops_dict = dashboard_utility.get_crop_list()
    return list(crops_dict)

def add_crop(crop_instance,location_instance):
    location_crop = Location_Crop.objects.get(location=location_instance)
    location_crop.name.add(crop_instance)

def delete_crop(crop_id):
    Crop.objects.filter(id=crop_id).delete()