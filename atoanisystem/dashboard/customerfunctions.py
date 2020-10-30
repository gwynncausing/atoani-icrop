from login_register.models import *
from login_register import connectivefunctions as dashboard_utility
import math

########################
#   HELPER FUNCTIONS   #
########################

#returns the [street, barangay, city, province] string format of the location instance
def get_location_str(location_id,street):
    if not math.isnan(location_id):
        location = Location.objects.get(id=location_id)
        loc = str(location)
        if street:
            loc = str(street)+', '+loc
        return loc
    else:
        return 'N/A'

#formats the location_id in orders list so that it will return the sting format of the location instance
def format_location(orders,user):
    street = user.customer.street
    for order in orders:
        order['location_id'] = get_location_str(order['location_id'],street)

#returns the total order
def get_total_orders(user):
    df = dashboard_utility.datatable_customer(user.customer)
    orders = dashboard_utility.display_customer_table(df)
    if orders == None:
        orders = []
    format_location(orders,user)
    return orders

#returns the reserved order, which is filtered using the status field
def get_reserved_orders(user):
    orders = get_total_orders(user)
    reserved_orders = []
    for order in orders:
        if order['status'] == 'Ongoing' or order['status'] == 'Harvested':
            reserved_orders.append(order)
    return reserved_orders

#returns the finished order, which is filtered using the status field
def get_finished_orders(user):
    orders = get_total_orders(user)
    finished_orders = []
    for order in orders:
        if order['status'] == 'Collected' or order['status'] == 'Delivered':
            finished_orders.append(order)
    return finished_orders

#returns the total order
def get_pending_orders(user):
    orders = orders = get_total_orders(user)
    pending_orders = []
    for order in orders:
        if order['status'] == 'Pending' or order['status'] == 'Posted':
            pending_orders.append(order)
    return pending_orders

########################
#  CUSTOMER FUNCTIONS  #
########################

#https://docs.djangoproject.com/en/3.1/topics/db/transactions/
#since django works in autocommit mode by default (see in Autocommit section), i assume that there will be no concurrent problems

#takes an instance of user/customer and other details to create an order

#returns the created object
def create_order(customer,crop_instance,weight,location_instance,land_area_needed):
    #order = dashboard_utility.add_order(customer.id,crop_instance.id,weight,location_instance.id)
    #create order
    order = Order.objects.create(
        customer=customer,
        crop=crop_instance,
        weight=weight,
        location=location_instance,
        land_area_needed=land_area_needed
    )
    
    #calculate the land area needed based on the order
    dashboard_utility.calculate_land_area_single({
        "order_id": order.order_id,
        "crop_id": order.crop_id,
        "harvest_weight_per_land_area": order.crop.harvest_weight_per_land_area,
        "productivity": order.crop.productivity,
        "weight": float(order.weight)
    })    
    print(order.land_area_needed)
    return order

#return all crops
def get_all_crops():
    return Crop.objects.all().values('id', 'name')