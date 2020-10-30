from login_register.models import *
from login_register import connectivefunctions as dashboard_utility
import math

########################
#   HELPER FUNCTIONS   #
########################

#returns the [street, barangay, city, province] string format of the location instance
def get_location_str(location_id,street):
    location = Location.objects.get(id=location_id)
    loc = str(location)
    print('LOCATION IS ' + loc)
    if street:
        loc = str(street)+', '+loc
    return loc

#formats the nan values to None because it will cause a parse error in javascript
def format_nan_values(list,column_key):
    for x in list:
        if math.isnan(x[column_key]):
            x[column_key]=None

#formats the location_id in orders list so that it will return the sting format of the location instance
def format_location(orders,user):
    
    for order in orders:
        #print('AWFAWFAWF',order)
        street = None#Customer.objects.get(id=order['customer_id']).street
        order['location_id'] = get_location_str(order['location_id'],street)

#formats the crop id into the crop name
#adds an additional field which is name (name of crop) to each dictionary in orders list
def format_crop_name(orders):
    for order in orders:
        order['name']=Crop.objects.get(id=order['crop_id']).name

#returns incoming orders from the recommendation algorithm
def get_incoming_orders(user):
    incoming_orders = dashboard_utility.matching_algorithm(user.farmer)
    print("@@@@@@@@@@@@@@@@@",incoming_orders)
    format_crop_name(incoming_orders)
    #format_location(incoming_orders,user)
    return incoming_orders

#returns the reserved orders of the farmer
#note that reserved orders has an order pair instance associated with them
def get_reserved_orders(user):
    df = dashboard_utility.datatable_farmer(user.farmer)
    orders = dashboard_utility.display_farmer_table(df)
    print(orders)
    format_location(orders,user)
    format_nan_values(orders,'land_area_needed')
    #print(orders)
    reserved_orders = []
    for order in orders:
        if order['status'] == 'Ongoing' and order['accepted_date'] != None:
            reserved_orders.append(order)
    print(reserved_orders)
    return reserved_orders

#returns the finished orders of the farmer
#only AtoANI can decide whether the collection is successful or not
#note that finished orders has an order pair instance associated with them
def get_finished_orders(user):
    df = dashboard_utility.datatable_farmer(user.farmer)
    orders = dashboard_utility.display_farmer_table(df)
    format_nan_values(orders,'land_area_needed')
    format_location(orders,user)
    finished_orders = []
    for order in orders:
        #CHANGE TO COLLECTED
        if order['status']=='Collected':
            finished_orders.append(order)
    return finished_orders

########################
#   FARMER FUNCTIONS   #
########################

#https://docs.djangoproject.com/en/3.1/topics/db/transactions/
#since django works in autocommit mode by default (see in Autocommit section), i assume that there will be no concurrent problems

#reserves the order for the farmer in the paramter 
#returns order_pair instance if successful, else None
def reserve_to(farmer,order):
    order_pair = None
    #assumes that order is already reserved for farmer
    order_pair = Order_Pairing(order_id = order, farmer = farmer)
    order_pair.save()
    print("RESEEEERRRRVEEE")
    print(order_pair.accepted_date)
    return order_pair

def cancel_reservation(order_pair):
    #clarify if farmer can cancel
    #get order instance, set order.is_reserved = False
    #set order_pair.is_canceled = True
    #delete from db?
    #propose that Order_Pair be Many_to_one?
    #****************************************WARNING************
    pass
