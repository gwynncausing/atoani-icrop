from login_register.models import *
import pandas as pd
from datetime import datetime as dt

def convert(time):
    try:
        return dt(time.year,time.month,time.day)
    except:
        return None


def get_order_pairing(id):
    df = pd.DataFrame(Order_Pairing.objects.filter(farmer_id=id).values())
    df['accepted_date'] = df['accepted_date'].apply(convert)
    return df

def search_pairing(predate,postdate,df):
    return df[(df['accepted_date'] >= predate) & (df['accepted_date'] <= postdate)]

def count_status(df):
    # assured that all order pairs have been accepted
    accepted = (df['harvest_date'].isnull()).sum()
    harvested = len((df.loc[(df['harvested_date'].notna()) & (df['collected_date'].isnull())]))
    collected = (df['collected_date'].notna()).sum()

    return [accepted, harvested, collected]
