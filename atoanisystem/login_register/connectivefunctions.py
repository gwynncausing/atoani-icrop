from login_register.models import *
import pandas as pd
from datetime import date

'''
FOR DATATABLE FUNCTIONS:

to generate datatable for both datatable views and view order
datatable = datatable_farmer(<farmer id>) or datatable_customer(<customer id>)

to generate datatable dictionary for dashboard datatables
datatable_dictionary = display_farmer_table(datatable) or display_customer_table(datatable)
'''

# insert part of the algorithm here involving land_area calculation
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
        return df[['order_pair_id','order_date','location_id','name','weight','status']].to_dict('records')

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

# create change status for orders
# check months for farmers ????
# order related functions

def calculate_land_area(order):
    order_crop = Crop.objects.filter(id=order['crop_id']).values('harvest_weight_per_land_area','productivity')[0]
    land_area = ((order['weight'] * 0.001)/order_crop['harvest_weight_per_land_area']) * 10000
    land_area = land_area + (land_area * (1-(order_crop['productivity']/100)))
    Order.objects.get(order_id=order['order_id']).set_value([['land_area_needed',land_area]])
    # return order_crop

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
            Order.objects.filter(order_id = merged_df.iloc[i]['order_id'])[0].set_value([["is_cancelled",True],["message","1 month overdue"]])
