#get the list of orders
def get_incoming_orders():
    #functions from recommendation algorithm to be put here
    #ask recommendation algorithm for list of dictionaries for recommended orders
    dummy = [
        {'crop_type':'corn','demand':'45 kg','land_area':'123 sqm','order_location':'Argao,Cebu'},
        {'crop_type':'rice','demand':'123 kg','land_area':'5112 sqm','order_location':'Argao,Cebu'},
        {'crop_type':'lalala','demand':'516 kg','land_area':'55 sqm','order_location':'Argao,Cebu'},
        {'crop_type':'corn','demand':'45 kg','land_area':'123 sqm','order_location':'Argao,Cebu'},
        {'crop_type':'rice','demand':'123 kg','land_area':'5112 sqm','order_location':'Argao,Cebu'},
        {'crop_type':'lalala','demand':'516 kg','land_area':'55 sqm','order_location':'Argao,Cebu'},
        {'crop_type':'corn','demand':'45 kg','land_area':'123 sqm','order_location':'Argao,Cebu'},
        {'crop_type':'rice','demand':'123 kg','land_area':'5112 sqm','order_location':'Argao,Cebu'},
        {'crop_type':'lalala','demand':'516 kg','land_area':'55 sqm','order_location':'Argao,Cebu'},
        {'crop_type':'corn','demand':'45 kg','land_area':'123 sqm','order_location':'Argao,Cebu'},
    ]
    return dummy

def get_reserved_orders(farmer):
    #get order_pairing related to farmer instance where is_canceled is False and is_completed is False
    dummy = [
        {'crop_type':'corn','demand':'45 kg','land_area':'123 sqm','order_location':'Argao,Cebu'},
        {'crop_type':'rice','demand':'123 kg','land_area':'5112 sqm','order_location':'Argao,Cebu'},
        {'crop_type':'lalala','demand':'516 kg','land_area':'55 sqm','order_location':'Argao,Cebu'},
        {'crop_type':'corn','demand':'45 kg','land_area':'123 sqm','order_location':'Argao,Cebu'},
        {'crop_type':'rice','demand':'123 kg','land_area':'5112 sqm','order_location':'Argao,Cebu'},
        {'crop_type':'lalala','demand':'516 kg','land_area':'55 sqm','order_location':'Argao,Cebu'},
        {'crop_type':'corn','demand':'45 kg','land_area':'123 sqm','order_location':'Argao,Cebu'},
        {'crop_type':'rice','demand':'123 kg','land_area':'5112 sqm','order_location':'Argao,Cebu'},
        {'crop_type':'lalala','demand':'516 kg','land_area':'55 sqm','order_location':'Argao,Cebu'},
        {'crop_type':'corn','demand':'45 kg','land_area':'123 sqm','order_location':'Argao,Cebu'},
    ]
    return dummy

def get_finished_orders(farmer):
    #get order_pairing related to farmer instance where is_canceled is False and is_completed is True
    dummy = [
        {'crop_type':'corn','demand':'45 kg','land_area':'123 sqm','order_location':'Argao,Cebu'},
        {'crop_type':'rice','demand':'123 kg','land_area':'5112 sqm','order_location':'Argao,Cebu'},
        {'crop_type':'lalala','demand':'516 kg','land_area':'55 sqm','order_location':'Argao,Cebu'},
        {'crop_type':'corn','demand':'45 kg','land_area':'123 sqm','order_location':'Argao,Cebu'},
        {'crop_type':'rice','demand':'123 kg','land_area':'5112 sqm','order_location':'Argao,Cebu'},
        {'crop_type':'lalala','demand':'516 kg','land_area':'55 sqm','order_location':'Argao,Cebu'},
        {'crop_type':'corn','demand':'45 kg','land_area':'123 sqm','order_location':'Argao,Cebu'},
        {'crop_type':'rice','demand':'123 kg','land_area':'5112 sqm','order_location':'Argao,Cebu'},
        {'crop_type':'lalala','demand':'516 kg','land_area':'55 sqm','order_location':'Argao,Cebu'},
        {'crop_type':'corn','demand':'45 kg','land_area':'123 sqm','order_location':'Argao,Cebu'},
    ]
    return dummy

#https://docs.djangoproject.com/en/3.1/topics/db/transactions/
#since django works in autocommit mode by default (see in Autocommit section), i assume that there will be no concurrent problems
def reserve_to(farmer,order):
    #check if order is not reserved
    #   if true, set order.is_reserved to true
    #   then, create an order_pair instance for farmer and order
    #success/true
    pass

def view_order(order_id):
    #return order details
    pass

def cancel_reservation(order_pair):
    #get order instance, set order.is_reserved = False
    #set order_pair.is_canceled = True
    #delete from db?
    pass

def complete_order(order_pair):
    #set order_pair.is_completed = True
    pass
