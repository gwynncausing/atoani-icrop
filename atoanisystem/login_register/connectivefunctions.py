from login_register.models import *
import pandas as pd
from datetime import date

# insert part of the algorithm here involving land_area calculation
# coordinate with reservation and recommendation tables
# ask for scope of dashboards
def convert(time):
    try:
        return dt(time.year,time.month,time.day)
    except:
        return None

def get_order_pairing_farmer(id):
    df = pd.DataFrame(Order_Pairing.objects.filter(farmer_id=id).values())
    df['accepted_date'] = df['accepted_date'].apply(convert)
    return df

def get_complete_order_pair_farmer(id):
    df = get_order_pairing(id)
    order_ids = [item[1] for item in df.values]
    orders = pd.DataFrame(Order.objects.filter(order_id__in=order_ids).values())
    crops = pd.DataFrame(Crop.objects.filter(id__in=[item[2] for item in orders.values]).values('id','name'))
    final_order = orders.merge(crops, left_on="crop_id",right_on="id").drop(columns=["crop_id","id"])
    return df.merge(final_order, left_on="order_id_id", right_on="order_id").drop(columns=["order_id_id","order_id"])

def search_pairing(predate,postdate,df):
    return df[(df['accepted_date'] >= predate) & (df['accepted_date'] <= postdate)]

# set an actual status part?
def count_status(df):
    # assured that all order pairs have been accepted
    accepted = (df['harvest_date'].isnull()).sum()
    harvested = len((df.loc[(df['harvested_date'].notna()) & (df['collected_date'].isnull())]))
    collected = (df['collected_date'].notna()).sum()

    return [accepted, harvested, collected]

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
