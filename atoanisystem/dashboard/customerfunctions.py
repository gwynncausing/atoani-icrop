from login_register.models import *
from login_register import connectivefunctions as dashboard_utility

#constants


#helper functions
def get_location_str(location_id):
    location = Location.objects.get(id=location_id)
    return str(location)

def format_location(orders):
    for order in orders:
        order['location_id'] = get_location_str(order['location_id'])

def get_total_orders(user):
    df = dashboard_utility.datatable_customer(user.customer)
    print("LENGTH OF DF ",len(df))
    orders = dashboard_utility.display_customer_table(df)
    return orders

def get_reserved_orders(user):
    orders = get_total_orders(user)
    reserved_orders = []
    for order in orders:
        if order['status'] == 'Ongoing':
            reserved_orders.append(order)
    format_location(reserved_orders)
    return reserved_orders

def get_finished_orders(user):
    orders = get_total_orders(user)
    finished_orders = []
    for order in orders:
        if order['status'] == 'Collected':
            finished_orders.append(order)
    format_location(finished_orders)
    return finished_orders

#https://docs.djangoproject.com/en/3.1/topics/db/transactions/
#since django works in autocommit mode by default (see in Autocommit section), i assume that there will be no concurrent problems
def create_order(customer,crop,weight):
    #Order.objects.create(customer=customer, crop=crop, weight=weight)
    #return true if success else false
    pass

def view_order(order_id):
    #return order details
    pass

def cancel_order(order_pair):
    #get order instance, set order.is_reserved = False
    #set order_pair.is_canceled = True
    #delete from db?
    pass