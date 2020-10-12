from login_register.models import *
from login_register import connectivefunctions as dashboard_utility
import math

########################
#   HELPER FUNCTIONS   #
########################

#returns the [street, barangay, city, province] string format of the location instance
def get_location_str(location_id):
    if not math.isnan(location_id):
        location = Location.objects.get(id=location_id)
        return str(location)
    else:
        return 'N/A'

#formats the location_id in orders list so that it will return the sting format of the location instance
def format_location(orders):
    for order in orders:
        order['location_id'] = get_location_str(order['location_id'])

#returns the total order
def get_total_orders(user):
    df = dashboard_utility.datatable_customer(user.customer)
    orders = dashboard_utility.display_customer_table(df)
    return orders

#returns the reserved order, which is filtered using the status field
def get_reserved_orders(user):
    orders = get_total_orders(user)
    reserved_orders = []
    for order in orders:
        if order['status'] == 'Ongoing':
            reserved_orders.append(order)
    format_location(reserved_orders)
    return reserved_orders

#returns the finished order, which is filtered using the status field
def get_finished_orders(user):
    orders = get_total_orders(user)
    finished_orders = []
    for order in orders:
        if order['status'] == 'Collected':
            finished_orders.append(order)
    format_location(finished_orders)
    return finished_orders

########################
#  CUSTOMER FUNCTIONS  #
########################

#https://docs.djangoproject.com/en/3.1/topics/db/transactions/
#since django works in autocommit mode by default (see in Autocommit section), i assume that there will be no concurrent problems

#takes an instance of user/customer and other details to create an order

#returns the created object
def create_order(customer,crop_instance,weight,location_instance,land_area_needed):
    return Order.objects.create(
        customer=customer,
        crop=crop_instance,
        weight=weight,
        location=location_instance,
        land_area_needed=land_area_needed
    )

def cancel_order(order_pair):
    #get order instance, set order.is_reserved = False
    #set order_pair.is_canceled = True
    #delete from db?
    pass