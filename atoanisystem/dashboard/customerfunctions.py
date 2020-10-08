#get the list of orders
def get_total_orders(customer):
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

def get_reserved_orders(customer):
    #get order_pairing related to customer instance
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

def get_finished_orders(customer):
    #get order_pairing related to customer instance
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