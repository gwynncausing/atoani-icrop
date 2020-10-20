from login_register.models import *
import pandas as pd
from datetime import date, timedelta

'''
----------------------------
FOR DATATABLE FUNCTIONS:
----------------------------
to generate datatable for both datatable views and view order
datatable = datatable_farmer(<farmer id>) or datatable_customer(<customer id>)

to generate datatable dictionary for dashboard datatables
datatable_dictionary = display_farmer_table(datatable) or display_customer_table(datatable)

-------------------------------
ALGORITHM FUNCTION (NOT FINAL)
-------------------------------

to generate a list of top 10 (or sa pilay maabot) recommendations
matching_algorithm(<farmer land_area>)

----------------------------
ACCOUNT CHANGE FUNCTIONS
----------------------------
TO COLLECTIVELY CHANGE FARMER DETAILS CALL
change_farmer_details(<farmer id>, <details>*)

TO COLLECTIVELY CHANGE CUSTOMER DETAILS CALL
change_customer_details(<customer id>, <details>*)

*details must be a 2D list whose list components follow the format
['name of the attribute', 'value']

e.g.
details = [['is_cancelled',True]['message','Overdue order']]

--------------------------
DATABASE ADDING FUNCTIONS
--------------------------

TO RESERVE ORDER
reserve_order(<order id>, <farmer id>)
(make sure that order_id is UUID, you can use Order['order_id'])

TO CHECK IF LOCATION EXISTS GIVEN A LOCATION AND RETURN THE APPROPRIATE LOCATION ID
USED TO GET LOCATION ID FOR CREATE ORDER
get_order_location(<customer id>,<candidate location dictionary>)

*note:  candidate location must be of the form {'street': , 'brgy', 'city', 'provice'}

---------------------------------------------------------
STARTUP FUNCTIONS / RUN EVERYTIME SOMETHING GETS UPDATED
---------------------------------------------------------

TO COLLECTIVELY CALCULATE LAND AREA
calculate_land_area()

RELATED TO RESERVE_ORDER, UPDATES TIME ESTIMATE DURING RESERVATION
update_time_single(<order pair>)

*note: function is included in reserve_order, so no need to call for upcoming order_pairing

----------------------------
CUSTOMER RELATED FUNCTIONS
----------------------------

TO GET ALL OF CUSTOMER'S LOCATIONS
get_customer_location(<customer id>)

-----------------
GETTER FUNCTIONS
-----------------

TO GET A DICTIONARY LIST OF ALL CROPS
get_crop_list()

--------------------------------------------------
SCHEDULED FUNCTIONS (SEE login_register/scheduler)
--------------------------------------------------

TO COLLECTIVELY CHECK OBSOLETE (1-Month Old) ORDERS
check_obsolete_orders()

*note: Automatically adds an "Overdue" message


'''

def convert(time):
    try:
        return dt(time.year,time.month,time.day)
    except:
        return None

# get farmer's accepted orders
def get_order_pairing_farmer(id):
    df = pd.DataFrame(Order_Pairing.objects.filter(farmer_id=id).values())
    if len(df) != 0:
        df['accepted_date'] = df['accepted_date'].apply(convert)
        return df.rename(columns={"id":"order_pair_id"})
    return df

# generates datatable for farmer dashboard
def datatable_farmer(id):
    df = get_order_pairing_farmer(id)
    if len(df) == 0:
        return df
    else:
        order_ids = [item[1] for item in df.values]
        orders = pd.DataFrame(Order.objects.filter(order_id__in=order_ids).values())
        crops = pd.DataFrame(Crop.objects.filter(id__in=[item[2] for item in orders.values]).values('id','name'))
        final_order = orders.merge(crops, left_on="crop_id",right_on="id").drop(columns=["crop_id","id"])
        return df.merge(final_order, left_on="order_id_id", right_on="order_id").drop(columns=["order_id_id","order_id"])

# to be called after datatable_farmer to generate datatable dictionary
# if no order_pairs exist, returns None
def display_farmer_table(df):
    if len(df) == 0:
        return df
    else:
        df = df.sort_values('accepted_date',ascending=False).reset_index(drop=True)
        return df[['order_pair_id','accepted_date','name','weight','land_area_needed','location_id','harvested_date','status']].to_dict('records')

# get customer's orders
def get_order_customer(id):
    df = pd.DataFrame(Order.objects.filter(customer=id).values())
    if len(df) != 0:
        df['order_date'] = df['order_date'].apply(convert)
        return df
    else:
        return df

# get crop details of customer's orders
def get_complete_order_customer(id):
    df = get_order_customer(id)
    if len(df) != 0:
        crops = pd.DataFrame(Crop.objects.filter(id__in=[item[2] for item in df.values]).values('id','name'))
        return df.merge(crops, left_on="crop_id", right_on="id").drop(columns=["crop_id","id"])
    else:
        return df

# generates datatable for customer dashboard
def datatable_customer(id):
    order= get_complete_order_customer(id)
    if len(order) !=0:
        df = pd.DataFrame(Order_Pairing.objects.filter(order_id_id__in=[val[0] for val in order.values]).values())
        if len(df) == 0:
            order[['order_pair_id', 'farmer_id', 'expected_time', 'accepted_date', 'harvested_date', 'collected_date']] = "N/A"
            return order
        else:
            df = order.merge(df, how="left", left_on="order_id", right_on="order_id_id").fillna("N/A").drop(columns=["order_id_id"])
            if len(df) != 0:
                df['accepted_date'] = df['accepted_date'].apply(convert)
                return df.rename(columns={'id':'order_pair_id'})
    return order

# to be called after datatable_customer to generate datatable dictionary
# if no orders, returns None
def display_customer_table(df):
    if len(df) == 0:
        return None
    else:
        df = df.sort_values('order_date',ascending=False).reset_index(drop=True)
        return df[['order_id','order_pair_id','order_date','location_id','name','weight','status']].to_dict('records')

# search a database based on date
def search_pairing(predate,postdate,df):
    return df[(df['accepted_date'] >= predate) & (df['accepted_date'] <= postdate)]

# count order_pair status for farmer
def count_status(df):
    # assured that all order pairs have been accepted
    accepted = (df['harvest_date'].isnull()).sum()
    harvested = len((df.loc[(df['harvested_date'].notna()) & (df['collected_date'].isnull())]))
    collected = (df['collected_date'].notna()).sum()

    return [accepted, harvested, collected]

# BACKEND FUNCTIONS

def change_farmer_details(id,details):
    Farmer.objects.get(id=id).set_value(details)

def change_customer_details(id,details):
    Customer.objects.get(id=id).set_value(details)

def reserve_order(order_id,farmer_id):
    d = Order_Pairing(order_id_id=order_id,farmer_id=farmer_id)
    d.save()
    update_time_single(d)
# check months for farmers ????
# order related functions

def update_time_single(order_pair):
    order = Order.objects.all().filter(order_id=order_pair.order_id_id).values('crop_id')[0]
    crop_time = Crop.objects.all().filter(id=order['crop_id']).values('harvest_time')[0]['harvest_time']
    order_pair.expected_time = convert(order_pair.accepted_date) + timedelta(days=crop_time)
    order_pair.save()

def add_order(customer_id, crop_id, demand, location_id):
    new_order = Order(customer_id=customer_id, crop_id=crop_id, weight=demand, location_id=location_id)
    new_order.save()
    calculate_land_area_single(new_order)
    new_order.save()

def update_land_area():
    for x in Order.objects.all().values():
        calculate_land_area(x)

# still a pseudo-algorithm
def matching_algorithm(land_size):
    pairs = Order_Pairing.objects.all().values('order_id_id')
    available_order = pd.DataFrame(Order.objects.exclude(order_id__in = [val['order_id_id'] for val in pairs]).values())
    available_order = available_order[available_order['land_area_needed'] <= land_size].sort_values('land_area_needed',ascending=False)
    return available_order[:10].to_dict('records')


def calculate_land_area_single(order):
    order_crop = Crop.objects.filter(id=order['crop_id']).values('harvest_weight_per_land_area','productivity')[0]
    land_area = ((order['weight'] * 0.001)/order_crop['harvest_weight_per_land_area']) * 10000
    land_area = land_area + (land_area * (1-(order_crop['productivity']/100)))
    Order.objects.get(order_id=order['order_id']).set_value([['land_area_needed',land_area]])
    # return order_crop

def calculate_land_area():
    [calculate_land_area_single(order) for order in Order.objects.filter(land_area_needed__isnull=True).values()]

def check_obsolete_orders():
    order = pd.DataFrame(Order.objects.all().values())
    pairs = pd.DataFrame(Order_Pairing.objects.all().values())
    merged_df = order.merge(pairs, how="left",left_on="order_id", right_on="order_id_id").drop(columns='order_id_id')
    merged_df['order_date'] = merged_df['order_date'].apply(convert)
    merged_df = merged_df.loc[merged_df['farmer_id'].isnull()]
    now = dt.now()
    date_now = dt(now.year, now.month, now.day)

    for i in range(len(merged_df)):
        val = merged_df.iloc[i]
        #if a month has passed and order is not cancelled
        if (date_now - val['order_date']).days > 29 and not val['is_cancelled']:
            Order.objects.get(order_id = merged_df.iloc[i]['order_id']).set_value([["is_cancelled",True],["message","1 month overdue"]])


def get_crop_list():
    return Crop.objects.all().values('id','name')

# used for adding order
def get_order_location(id,loc):
    # checks for loc similar toexisting addresses in customer
    for location_record in Customer.objects.get(id=id).location.all():
        if loc['street'] == location_record.street and loc['brgy'] == location_record.brgy and loc['city'] == location_record.city and loc['province'] == location_record.province:
            return customer_location
    # no match, create new location
    newloc = Location(street=loc['street'], brgy = loc['brgy'], city = loc['city'], province = loc['province'] )
    newloc.save()
    return Location.objects.latest('id').id

def get_customer_location(id):
    return Customer.objects.get(id=id).get_locations()
