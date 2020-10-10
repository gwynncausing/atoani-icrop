from login_register.models import *
from login_register import connectivefunctions as dashboard_utility
import math

def get_location_str(location_id):
    if not math.isnan(location_id):
        location = Location.objects.get(id=location_id)
        return str(location)
    else:
        return 'N/A'

def format_nan_values(list,column_key):
    for x in list:
        if math.isnan(x[column_key]):
            x[column_key]=None

def format_location(orders):
    for order in orders:
        order['location_id'] = get_location_str(order['location_id'])

def format_crop_name(orders):
    for order in orders:
        order['name']=Crop.objects.get(id=order['crop_id']).name

def get_incoming_orders(user):
    incoming_orders = dashboard_utility.matching_algorithm(user.farmer.land_area)
    format_crop_name(incoming_orders)
    format_location(incoming_orders)
    return incoming_orders

#TO BE IMPLEMENTED
def get_reserved_orders(user):
    df = dashboard_utility.datatable_farmer(user.farmer)
    orders = dashboard_utility.display_farmer_table(df)
    format_location(orders)
    format_nan_values(orders,'land_area_needed')
    print(orders)
    reserved_orders = []
    for order in orders:
        if order['accepted_date'] and order['status'] != 'Collected':
            reserved_orders.append(order)
    return reserved_orders

def get_finished_orders(user):
    df = dashboard_utility.datatable_farmer(user.farmer)
    orders = dashboard_utility.display_farmer_table(df)
    format_nan_values(orders,'land_area_needed')
    format_location(orders)
    finished_orders = []
    for order in orders:
        #CHANGE TO COLLECTED
        if order['status']=='Collected':
            finished_orders.append(order)
    return finished_orders

#https://docs.djangoproject.com/en/3.1/topics/db/transactions/
#since django works in autocommit mode by default (see in Autocommit section), i assume that there will be no concurrent problems
def reserve_to(farmer,order):
    status = False
    #check if order is not reserved
    if not order.is_reserved:
        order.is_reserved = True
        #expected_time =
        #accepted_date = 
        #Order_Pairing.objects.create(order_id = order, farmer = farmer, )
        status = True
    return status

def view_order(order_id):
    #return order instance?
    #return order dictionary?
    pass

def cancel_reservation(order_pair):
    #get order instance, set order.is_reserved = False
    #set order_pair.is_canceled = True
    #delete from db?
    #propose that Order_Pair be Many_to_one?
    #****************************************WARNING************
    pass

def complete_order(order_pair):
    #set order_pair.date_finished to timezone.now() or datetime.now()
    pass
